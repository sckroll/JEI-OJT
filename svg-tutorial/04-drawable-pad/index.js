const SVG_NS = 'http://www.w3.org/2000/svg'

let isDragging = false, $currPath = null

const $memoContainer = document.getElementById('memo-container')
const $btnUndo = document.querySelector('.btn-undo')
const $btnClear = document.querySelector('.btn-clear')

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
  $memoContainer.appendChild($currPath)

})
window.addEventListener('pointerup', () => {
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
$btnUndo.addEventListener('click', e => {
  e.stopPropagation()

  if ($memoContainer.childElementCount === 0) return
  $memoContainer.removeChild($memoContainer.lastChild)
})
$btnClear.addEventListener('click', e => {
  e.stopPropagation()

  while ($memoContainer.childElementCount > 0) {
    $memoContainer.removeChild($memoContainer.lastChild)
  }
})