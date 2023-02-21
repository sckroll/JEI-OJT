import getClosestPoint from "./closestPoint.js"

let startTime = null, animationId = null, currLength = null, prevBestLength = 0
let isDragging = false, isFinished = false

const clickSound = new Audio('mp3/MP_Blop.mp3')
const successSound = new Audio('mp3/MP_스테이지 클리어 (레트로).mp3')

const $speaker = document.querySelector('.speaker')
const title = document.querySelector('.title').textContent

/**
 * 음성 합성
 */

const synth = window.speechSynthesis
const speech = new SpeechSynthesisUtterance(title)
speech.voice = synth.getVoices().filter(v => v.lang === 'ko-KR')[0]
$speaker.addEventListener('click', () => {
  synth.speak(speech)
})

/**
 * 좌측 패스 애니메이션
 */

const $circleOuter1 = document.querySelector('.circle-outer-1')
$circleOuter1.setAttribute('stroke-dasharray', $circleOuter1.getTotalLength())
$circleOuter1.setAttribute('stroke-dashoffset', $circleOuter1.getTotalLength())

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

/**
 * 우측 패스 인터랙션
 */

const $circleOuter2 = document.querySelector('.circle-outer-2')
currLength = $circleOuter2.getTotalLength()
$circleOuter2.setAttribute('stroke-dasharray', currLength)
$circleOuter2.setAttribute('stroke-dashoffset', currLength)

const $interactionContainer = document.getElementById('interaction-container')
const $circleIndicator = document.querySelector('.circle-indicator')
$circleIndicator.addEventListener('pointerdown', e => {
  if (!isFinished && !isDragging) isDragging = true
  clickSound.play()
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

  const { distance, bestLength } = getClosestPoint($circleOuter2, [point.x, point.y])
  if (distance > 10 || Math.abs(bestLength - prevBestLength > 90)) return
  // console.log(distance, bestLength, currLength)

  currLength = Math.min(currLength, $circleOuter2.getTotalLength() - bestLength)
  $circleOuter2.setAttribute('stroke-dashoffset', currLength)
  $circleIndicator.setAttribute('transform', `rotate(${-($circleOuter2.getTotalLength() - currLength) / $circleOuter2.getTotalLength() * 360} 60 60)`)
  prevBestLength = bestLength
  if (~~currLength < 5) {
    $circleOuter2.setAttribute('stroke-dashoffset', 0)
    $circleIndicator.setAttribute('transform', 'rotate(0 60 60)')
    isFinished = true

    $circleOuter2.classList.add('success')
    $circleIndicator.classList.add('success')
    successSound.play()
  }
})

