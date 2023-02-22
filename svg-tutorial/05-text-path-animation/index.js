// const $paths = document.getElementsByClassName('path-outside')
// for (const $path of $paths) {
//   const totalLength = $path.getTotalLength()
//   $path.setAttributeNS(null, 'stroke-dasharray', totalLength)
//   $path.setAttributeNS(null, 'stroke-dashoffset', totalLength)
// }

// let animationId = null, startTime = null
// const drawPath = timestamp => {
//   if (!startTime) startTime = timestamp

//   const diffTime = timestamp - startTime
//   const $path = document.getElementsByClassName('path-outside')[0]
//   const dashOffset = $path.getAttributeNS(null, 'stroke-dashoffset')

//   if (dashOffset < 5) {
//     cancelAnimationFrame(animationId)
//   } else {
//     $path.getAttributeNS(null, dashOffset - diffTime)
//     animationId = requestAnimationFrame(drawPath)
//   }
// }
// animationId = requestAnimationFrame(drawPath)