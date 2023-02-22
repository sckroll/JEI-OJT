const BUTTON_GAP = 40, BUTTON_MARGIN = 64, BUTTON_SIZE = 32

const colors = ['red', 'blue', 'green', 'black']
const widths = [1, 2, 4, 8]

let isDragging = false, $currPath = null, currMargin = BUTTON_MARGIN
let pathColor = colors[3], pathWidth = widths[1]

const $svgContainer = document.getElementById('svg-container')
const $memoContainer = document.getElementById('memo-container')
const $btnGroup = document.querySelector('.btn-group')

/**
 * SVG 좌표계로 변환
 */
const convertToSVGCoord = (x, y, $el) => {
  const point = $el.createSVGPoint()
  point.x = x
  point.y = y
  return point.matrixTransform($el.getScreenCTM().inverse())
}

/**
 * SVG 요소 생성
 */
const createSVGElement = ({ type, parent, attributes }) => {
  const SVG_NS = 'http://www.w3.org/2000/svg'
  const $el = document.createElementNS(SVG_NS, type)

  for (const [key, value] of Object.entries(attributes)) {
    $el.setAttributeNS(null, key, value)
  }
  parent.appendChild($el)
  return $el
}

/**
 * 선 그리기
 */
$svgContainer.addEventListener('pointerdown', ({ clientX, clientY, target, button }) => {
  // 버튼 위에서 드래그할 경우 버튼이 눌리지 않는 현상 방지
  // 마우스 왼쪽 버튼만 허용
  if (!target.classList.contains('drag-safe') || button !== 0) return
  if (!isDragging) isDragging = true

  const { x, y } = convertToSVGCoord(clientX, clientY, $memoContainer)
  $currPath = createSVGElement({
    type: 'path',
    parent: $memoContainer,
    attributes: {
      class: 'path-line drag-safe',
      d: `M${x},${y}`,
      stroke: pathColor,
      'stroke-width': pathWidth
    }
  })
})
$svgContainer.addEventListener('pointerup', ({ target }) => {
  if (isDragging) isDragging = false

  // 버튼 위에서 드래그할 경우 버튼이 눌리지 않 는 현상 방지
  if (!target.classList.contains('drag-safe')) return

  // 점만 찍을 경우
  const prevPath = $currPath.getAttributeNS(null, 'd')
  if (!prevPath.includes('L')) $currPath.setAttributeNS(null, 'd', prevPath + 'l 0, 1')
})
$svgContainer.addEventListener('pointermove', ({ clientX, clientY }) => {;
  if (!isDragging) return

  const { x, y } = convertToSVGCoord(clientX, clientY, $memoContainer)
  const prevPath = $currPath.getAttributeNS(null, 'd')

  // 소수점 버리기
  $currPath.setAttributeNS(null, 'd', prevPath + `L${Math.round(x)},${Math.round(y)}`)
})
// 뷰포트 밖에서 클릭 & 드래그를 멈추고 다시 뷰포트 안으로 들어오면 그리기 중지
$svgContainer.addEventListener('pointerleave', () => {
  if (isDragging) isDragging = false
})

/**
 * 버튼 동적 생성
 */
createSVGElement({
  type: 'use',
  parent: $btnGroup,
  attributes: {
    href: '#btn-clear',
    class: 'btn-clear',
    x: `calc(100% - ${currMargin}px)`,
    y: `calc(100% - ${BUTTON_MARGIN}px)`,
    width: BUTTON_SIZE,
    height: BUTTON_SIZE
  }
})
currMargin += BUTTON_GAP
createSVGElement({
  type: 'use',
  parent: $btnGroup,
  attributes: {
    href: '#btn-undo',
    class: 'btn-undo',
    x: `calc(100% - ${currMargin}px)`,
    y: `calc(100% - ${BUTTON_MARGIN}px)`,
    width: BUTTON_SIZE,
    height: BUTTON_SIZE
  }
})
for (const color of colors.reverse()) {
  currMargin += BUTTON_GAP
  createSVGElement({
    type: 'use',
    parent: $btnGroup,
    attributes: {
      href: '#btn-color',
      class: `btn-color ${color}`,
      x: `calc(100% - ${currMargin}px)`,
      y: `calc(100% - ${BUTTON_MARGIN}px)`,
      width: BUTTON_SIZE,
      height: BUTTON_SIZE,
      fill: color
    }
  })
}
for (const width of widths.reverse()) {
  currMargin += BUTTON_GAP
  createSVGElement({
    type: 'use',
    parent: $btnGroup,
    attributes: {
      href: '#btn-width',
      class: `btn-width w${width}`,
      x: `calc(100% - ${currMargin}px)`,
      y: `calc(100% - ${BUTTON_MARGIN}px)`,
      width: BUTTON_SIZE,
      height: BUTTON_SIZE,
      'stroke-width': width
    }
  })
}

/**
 * 현재 선 색상 및 굵기 표시
 */
const initialColorOffset = document.querySelector(`.btn-color.${pathColor}`).x.baseVal.value
const $colorSelected = createSVGElement({
  type: 'circle',
  parent: $btnGroup,
  attributes: {
    class: 'color-selected',
    cx: initialColorOffset + 16,
    cy: `calc(100% - ${BUTTON_MARGIN}px + ${BUTTON_SIZE / 2}px)`,
    r: (BUTTON_SIZE / 2) - 2
  }
})
const initialWidthOffset = document.querySelector(`.btn-width.w${pathWidth}`).x.baseVal.value
const $widthSelected = createSVGElement({
  type: 'circle',
  parent: $btnGroup,
  attributes: {
    class: 'width-selected',
    cx: initialWidthOffset + 16,
    cy: `calc(100% - ${BUTTON_MARGIN}px + ${BUTTON_SIZE / 2}px)`,
    r: (BUTTON_SIZE / 2) - 2
  }
})

/**
 * 버튼 이벤트 핸들링
 */
$btnGroup.addEventListener('click', e => {
  e.stopPropagation()

  const btnType = e.target.classList[0]
  if (btnType === 'btn-undo') {
    if ($memoContainer.childElementCount === 0) return
    $memoContainer.removeChild($memoContainer.lastChild)
  } else if (btnType === 'btn-clear') {
    while ($memoContainer.childElementCount > 0) {
      $memoContainer.removeChild($memoContainer.lastChild)
    }
  } else if (btnType === 'btn-color') {
    pathColor = e.target.classList[1] || 'black'
    $colorSelected.setAttributeNS(null, 'cx', `${e.target.x.baseVal.value + (BUTTON_SIZE / 2)}`)
  } else if (btnType === 'btn-width') {
    pathWidth = e.target.classList[1][1] || '2'
    $widthSelected.setAttributeNS(null, 'cx', `${e.target.x.baseVal.value + (BUTTON_SIZE / 2)}`)
  }
})