import getClosestPoint from "./closestPoint.js"

const DECREASING_SPEED_FACTOR = 10
const MAX_ADJUST_ARROW_DIFF = 10
const MAX_PATH_LENGTH_DIFF = 90
const LAST_LEFT_LENGTH = 5

const clickSound = new Audio('mp3/MP_Blop.mp3')
const successSound = new Audio('mp3/MP_스테이지 클리어 (레트로).mp3')

/**
* 음성 합성
*/

const $speaker = document.querySelector('.speaker')
const title = document.querySelector('.title').textContent

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
const pathLength1 = $circleOuter1.getTotalLength()
$circleOuter1.setAttribute('stroke-dasharray', pathLength1)
$circleOuter1.setAttribute('stroke-dashoffset', pathLength1)

let startTime, animationId
const drawCircle = timestamp => {
  if (!startTime) startTime = timestamp

  const diffTime = timestamp - startTime
  const circleLength = pathLength1 - diffTime / DECREASING_SPEED_FACTOR
  $circleOuter1.setAttribute('stroke-dashoffset', circleLength)

  if (circleLength >= 0) {
    animationId = requestAnimationFrame(drawCircle)
  } else {
    cancelAnimationFrame(animationId)

    // 패스가 다 차면 dashoffset을 0으로 고정
    $circleOuter1.setAttribute('stroke-dashoffset', 0)
    $circleOuter1.classList.add('success')
  }
}

animationId = requestAnimationFrame(drawCircle)

/**
 * 우측 패스 인터랙션
 */

const $circleOuter2 = document.querySelector('.circle-outer-2')
const $interactionContainer = document.getElementById('interaction-container')
const $circleIndicator = document.querySelector('.circle-indicator')

const pathLength2 = $circleOuter2.getTotalLength()
let currLength = pathLength2
let isDragging = false, isFinished = false, prevBestLength = 0

$circleOuter2.setAttribute('stroke-dasharray', currLength)
$circleOuter2.setAttribute('stroke-dashoffset', currLength)

$circleIndicator.addEventListener('pointerdown', async () => {
  if (!isFinished && !isDragging) isDragging = true
  await clickSound.play()
})
window.addEventListener('pointerup', () => {
  if (!isFinished && isDragging) isDragging = false
})
window.addEventListener('pointermove', ({ clientX, clientY }) => {
  if (isFinished || !isDragging) return

  // SVG 좌표계로 변환
  let point = $interactionContainer.createSVGPoint()
  point.x = clientX
  point.y = clientY
  point = point.matrixTransform($interactionContainer.getScreenCTM().inverse())

  // 지금까지 그린 패스의 길이, 화살표로부터의 거리를 계산
  const { distance, bestLength } = getClosestPoint($circleOuter2, [point.x, point.y])
  if (distance > MAX_ADJUST_ARROW_DIFF || Math.abs(bestLength - prevBestLength) > MAX_PATH_LENGTH_DIFF) return
  // console.log(distance, bestLength, currLength)

  // 이전 패스로 돌아가지 않도록 처리
  currLength = Math.min(currLength, pathLength2 - bestLength)
  prevBestLength = bestLength
  
  // 패스 한가운데를 중심으로 화살표 회전
  $circleIndicator.setAttribute('transform', `rotate(${-(pathLength2 - currLength) / pathLength2 * 360} 60 60)`)
  $circleOuter2.setAttribute('stroke-dashoffset', currLength)

  // 패스의 마지막에 다다랐으면 남은 패스를 꽉 채우고 화살표 고정
  if (~~currLength < LAST_LEFT_LENGTH) {
    $circleOuter2.setAttribute('stroke-dashoffset', 0)
    $circleIndicator.setAttribute('transform', 'rotate(0 60 60)')
    isFinished = true

    $circleOuter2.classList.add('success')
    $circleIndicator.remove()
    successSound.play()

    setTimeout(() => {
      window.parent.postMessage({ state: 'success' })
    }, 1000)
  }
})