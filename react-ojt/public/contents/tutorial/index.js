const DECREASING_SPEED_FACTOR = 10

const clickSound = new Audio('mp3/MP_Blop.mp3')

/**
* 음성 합성
*/

const $speaker = document.querySelector('.speaker')
const title = '세 종류의 문제가 총 여섯 번 출제될 거에요. 준비가 되었다면 아래의 다음 버튼을 눌러주세요.'

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