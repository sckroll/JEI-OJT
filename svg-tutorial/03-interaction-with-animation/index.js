const $circleOuter1 = document.querySelector('.circle-outer-1')
let startTime = null, animationId = null

$circleOuter1.setAttribute('stroke-dasharray', $circleOuter1.getTotalLength())

const draw = timestamp => {
  if (!startTime) startTime = timestamp
  
  const diffTime = timestamp - startTime
  const circleLength = $circleOuter1.getTotalLength() - diffTime / 10
  $circleOuter1.setAttribute('stroke-dashoffset', circleLength)

  if (circleLength >= 0) {
    animationId = requestAnimationFrame(draw)
  } else {
    cancelAnimationFrame(animationId)
  }
}

animationId = requestAnimationFrame(draw)