import getClosestPoint from "./closestPoint.js"

let startTime = null, animationId = null, currLength = null, prevBestLength = 0
let isDragging = false, isFinished = false

const $circleOuter1 = document.querySelector('.circle-outer-1')
$circleOuter1.setAttribute('stroke-dasharray', $circleOuter1.getTotalLength())
$circleOuter1.setAttribute('stroke-dashoffset', $circleOuter1.getTotalLength())

const $circleOuter2 = document.querySelector('.circle-outer-2')
currLength = $circleOuter2.getTotalLength()
$circleOuter2.setAttribute('stroke-dasharray', currLength)
$circleOuter2.setAttribute('stroke-dashoffset', currLength)

const $interactionContainer = document.getElementById('interaction-container')
const $circleIndicator = document.querySelector('.circle-indicator')
$circleIndicator.addEventListener('pointerdown', e => {
  if (!isFinished && !isDragging) isDragging = true
})
window.addEventListener('pointerup', e => {
  if (!isFinished && isDragging) isDragging = false
})
window.addEventListener('pointermove', e => {
  if (isFinished || !isDragging) return

  let point = $interactionContainer.createSVGPoint()
  point.x = e.clientX
  point.y = e.clientY
  point = point.matrixTransform($interactionContainer.getScreenCTM().inverse())

  const { bestLength } = getClosestPoint($circleOuter2, [point.x, point.y])
  // console.log(bestLength, currLength)
  if (Math.abs(bestLength - prevBestLength > 180)) return

  currLength = Math.min(currLength, $circleOuter2.getTotalLength() - bestLength)
  $circleOuter2.setAttribute('stroke-dashoffset', currLength)
  $circleIndicator.setAttribute('transform', `rotate(${-($circleOuter2.getTotalLength() - currLength) / $circleOuter2.getTotalLength() * 360} 60 60)`)
  prevBestLength = bestLength
  if (~~currLength < 3) {
    $circleOuter2.setAttribute('stroke-dashoffset', 0)
    $circleIndicator.setAttribute('transform', 'rotate(0 60 60)')
    isFinished = true
  }
})

const drawCircle = timestamp => {
  if (!startTime) startTime = timestamp
  
  const diffTime = timestamp - startTime
  const circleLength = $circleOuter1.getTotalLength() - diffTime / 10
  $circleOuter1.setAttribute('stroke-dashoffset', circleLength)

  if (circleLength >= 0) {
    animationId = requestAnimationFrame(drawCircle)
  } else {
    cancelAnimationFrame(animationId)
    startTime = null
  }
}

animationId = requestAnimationFrame(drawCircle)