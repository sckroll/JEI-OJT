const SVG_NS = 'http://www.w3.org/2000/svg'

let isDragging = false, $currPath = null

const $memoContainer = document.getElementById('svg-container')

/**
 * SVG 좌표계로 변환
 */
const convertToSVGCoord = (x, y, $el) => {
  const point = $el.createSVGPoint()
  point.x = x
  point.y = y
  return point.matrixTransform($el.getScreenCTM().inverse())
}

$memoContainer.addEventListener('pointerdown', ({ clientX, clientY }) => {
  if (!isDragging) isDragging = true

  const { x, y } = convertToSVGCoord(clientX, clientY, $memoContainer)
  $currPath = document.createElementNS(SVG_NS, 'path')
  $currPath.setAttributeNS(null, 'class', 'path-line')
  $currPath.setAttributeNS(null, 'd', `M${x},${y}`)
  $memoContainer.appendChild($currPath)
})
$memoContainer.addEventListener('pointerup', () => {
  if (isDragging) isDragging = false

  // 점만 찍고 이동하지 않은 경우 해당 패스 삭제
  const prevPath = $currPath.getAttributeNS(null, 'd')
  if (!prevPath.includes('L')) $currPath.remove()
})
$memoContainer.addEventListener('pointermove', ({ clientX, clientY }) => {;
  if (!isDragging) return

  const { x, y } = convertToSVGCoord(clientX, clientY, $memoContainer)
  const prevPath = $currPath.getAttributeNS(null, 'd')

  // 소수점 버리기
  $currPath.setAttributeNS(null, 'd', prevPath + `L${Math.round(x)},${Math.round(y)}`)
})
// 그리는 중 뷰포트 밖으로 나갈 경우 그리기 중지
$memoContainer.addEventListener('pointerleave', () => {
  if (isDragging) isDragging = false
})