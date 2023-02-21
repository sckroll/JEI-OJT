const SVG_NS = 'http://www.w3.org/2000/svg'

let isDragging = false, $currPath = null, pathColor = 'black', pathWidth = '2'

const $memoContainer = document.getElementById('memo-container')
const $btnUndo = document.querySelector('.btn-undo')
const $btnClear = document.querySelector('.btn-clear')
const $btnGroup = document.querySelector('.btn-group')
const $widthSelected = document.querySelector('.width-selected')
const $colorSelected = document.querySelector('.color-selected')

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
 * 선 그리기
 */
window.addEventListener('pointerdown', ({ clientX, clientY, target }) => {
  // 버튼 위에서 드래그할 경우 버튼이 눌리지 않는 현상 방지
  if(!target.classList.contains('drag-safe')) return
  if (!isDragging) isDragging = true

  const { x, y } = convertToSVGCoord(clientX, clientY, $memoContainer)
  $currPath = document.createElementNS(SVG_NS, 'path')
  $currPath.setAttributeNS(null, 'class', 'path-line drag-safe')
  $currPath.setAttributeNS(null, 'd', `M${x},${y}`)
  $currPath.setAttributeNS(null, 'stroke', pathColor)
  $currPath.setAttributeNS(null, 'stroke-width', pathWidth)
  $memoContainer.appendChild($currPath)

})
window.addEventListener('pointerup', ({ target }) => {
  // 버튼 위에서 드래그할 경우 버튼이 눌리지 않는 현상 방지
  if (!target.classList.contains('drag-safe')) return
  if (isDragging) isDragging = false

  // 점만 찍고 이동하지 않은 경우 해당 패스 삭제
  const prevPath = $currPath.getAttributeNS(null, 'd')
  if (!prevPath.includes('L')) $currPath.remove()
})
window.addEventListener('pointermove', ({ clientX, clientY }) => {;
  if (!isDragging) return

  const { x, y } = convertToSVGCoord(clientX, clientY, $memoContainer)
  const prevPath = $currPath.getAttributeNS(null, 'd')

  // 소수점 버리기
  $currPath.setAttributeNS(null, 'd', prevPath + `L${Math.round(x)},${Math.round(y)}`)
})
// 뷰포트 밖에서 클릭 & 드래그를 멈추고 다시 뷰포트 안으로 들어오면 그리기 중지
window.addEventListener('pointerleave', () => {
  if (isDragging) isDragging = false
})

/**
 * 버튼 핸들링
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

    if (pathColor === 'red') $colorSelected.setAttributeNS(null, 'cx', 'calc(100% - 304px + 16px)')
    else if (pathColor === 'blue') $colorSelected.setAttributeNS(null, 'cx', 'calc(100% - 256px + 16px)')
    else if (pathColor === 'green') $colorSelected.setAttributeNS(null, 'cx', 'calc(100% - 208px + 16px)')
    else $colorSelected.setAttributeNS(null, 'cx', 'calc(100% - 160px + 16px)')
  } else if (btnType === 'btn-width') {
    pathWidth = e.target.classList[1] || '2'

    if (pathWidth === '1') $widthSelected.setAttributeNS(null, 'cx', 'calc(100% - 496px + 16px)')
    else if (pathWidth === '4') $widthSelected.setAttributeNS(null, 'cx', 'calc(100% - 400px + 16px)')
    else if (pathWidth === '8') $widthSelected.setAttributeNS(null, 'cx', 'calc(100% - 352px + 16px)')
    else $widthSelected.setAttributeNS(null, 'cx', 'calc(100% - 448px + 16px)')
  }
})