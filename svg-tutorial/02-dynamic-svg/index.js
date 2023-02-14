const SVG_NS = 'http://www.w3.org/2000/svg'
const FRAME_TEXT = '🔈 다음 덧셈을 하세요.'
const CORRECT_TITLE = '와우! 잘했어요!'
const INCORRECT_MSG = '다시 생각해볼까요?'
const FAILED_TITLE = '조금 아쉬워요!'
const CORRECT_CONTENT = '다음 문제도 풀어볼까요?'
const BTN_MSG_NEXT = '풀어볼래요'

const firstNum = ~~(Math.random() * 8) + 1
// const secondNum = ~~(Math.random() * (9 - firstNum)) + 1
const secondNum = 1
let isChecked = Array(10).fill(false)
let leftCnt = 3
let toastTimeoutId = null, fadeTimeoutId = null



const $container = document.getElementById('container')
const $svgContainer = document.getElementById('svg-container')



const isCorrect = myAnswer => firstNum + secondNum === myAnswer

const buttonHandler = ({ target }) => {
  const myAnswer = +target.parentNode.dataset.value

  if (isChecked[myAnswer]) return
  if (isCorrect(myAnswer)) {
    const $squareText = document.querySelector('.square-text')
    $squareText.textContent = myAnswer
    $squareText.classList.add('corrected')

    const $modalOverlay = document.createElement('div')
    $modalOverlay.className = 'modal-overlay'
    $container.appendChild($modalOverlay)

    const $modalContiainer = document.createElement('section')
    $modalContiainer.classList = 'modal-container'
    $modalOverlay.appendChild($modalContiainer)

    const $modalTitle = document.createElement('h1')
    $modalTitle.innerText = CORRECT_TITLE
    $modalContiainer.appendChild($modalTitle)

    const $modalContent = document.createElement('p')
    $modalContent.innerText = CORRECT_CONTENT
    $modalContiainer.appendChild($modalContent)

    const $modalButton = document.createElement('button')
    $modalButton.innerText = BTN_MSG_NEXT
    $modalContiainer.appendChild($modalButton)
    $modalButton.addEventListener('click', () => {
      console.log('준비중');
    })

    fadeTimeoutId = setTimeout(() => {
      $modalOverlay.classList.add('visible')
      clearTimeout(fadeTimeoutId)
    }, 10)
  } else {
    leftCnt--
    document.querySelectorAll('.number-btn-outer')[myAnswer].classList.add('incorrected')
    isChecked[myAnswer] = true
    
    document.querySelector('.incorrect-toast').classList.add('visible')
    toastTimeoutId = setTimeout(() => {
      document.querySelector('.incorrect-toast').classList.remove('visible')
      clearTimeout(toastTimeoutId)
    }, 1000)
  }
  if (leftCnt === 0) {
    console.log('조금 아쉬워요!')
  }
}



const $titleContainer = document.createElementNS(SVG_NS, 'text')
$titleContainer.textContent = FRAME_TEXT
$titleContainer.setAttributeNS(null, 'x', 30)
$titleContainer.setAttributeNS(null, 'y', 50)
$titleContainer.setAttributeNS(null, 'font-size', '1.25rem')
$svgContainer.appendChild($titleContainer)



const $imageContainer = document.createElementNS(SVG_NS, 'svg')
$imageContainer.setAttributeNS(null, 'x', 340 - 18 * (firstNum + secondNum - 2))
$imageContainer.setAttributeNS(null, 'y', 20)
$imageContainer.setAttributeNS(null, 'width', '50%')
$imageContainer.setAttributeNS(null, 'height', '50%')
$imageContainer.setAttributeNS(null, 'viewBox', `0 0 230 40`)
$svgContainer.appendChild($imageContainer)

const $firstRect = document.createElementNS(SVG_NS, 'rect')
$firstRect.setAttributeNS(null, 'x', 10)
$firstRect.setAttributeNS(null, 'y', 20)
$firstRect.setAttributeNS(null, 'rx', 10)
$firstRect.setAttributeNS(null, 'width', 20 * firstNum)
$firstRect.setAttributeNS(null, 'height', 20)
$firstRect.setAttributeNS(null, 'fill', 'transparent')
$firstRect.setAttributeNS(null, 'stroke', 'cyan')
$imageContainer.appendChild($firstRect)

for (let i = 0; i < firstNum; i++) {
  const $dot = document.createElementNS(SVG_NS, 'circle')
  $dot.setAttributeNS(null, 'cx', 20 * (i + 1))
  $dot.setAttributeNS(null, 'cy', 30)
  $dot.setAttributeNS(null, 'r', 4)
  $dot.setAttributeNS(null, 'fill', 'LightCoral')
  $imageContainer.appendChild($dot)
}

const $secondRect = document.createElementNS(SVG_NS, 'rect')
$secondRect.setAttributeNS(null, 'x', 20 * (firstNum + 1))
$secondRect.setAttributeNS(null, 'y', 20)
$secondRect.setAttributeNS(null, 'rx', 10)
$secondRect.setAttributeNS(null, 'width', 20 * secondNum)
$secondRect.setAttributeNS(null, 'height', 20)
$secondRect.setAttributeNS(null, 'fill', 'transparent')
$secondRect.setAttributeNS(null, 'stroke', 'cyan')
$imageContainer.appendChild($secondRect)

for (let i = 0; i < secondNum; i++) {
  const $dot = document.createElementNS(SVG_NS, 'circle')
  $dot.setAttributeNS(null, 'cx', 20 * (firstNum + 1.5 + i))
  $dot.setAttributeNS(null, 'cy', 30)
  $dot.setAttributeNS(null, 'r', 4)
  $dot.setAttributeNS(null, 'fill', 'MediumSlateBlue')
  $imageContainer.appendChild($dot)
}

const $linkPath = document.createElementNS(SVG_NS, 'path')
$linkPath.setAttributeNS(null, 'd', `M ${20 * firstNum} 20 c 0 -15, 30 -15, 30 0`)
$linkPath.setAttributeNS(null, 'fill', 'transparent')
$linkPath.setAttributeNS(null, 'stroke', 'cyan')
$imageContainer.appendChild($linkPath)



const $textContainer = document.createElementNS(SVG_NS, 'svg')
$textContainer.setAttributeNS(null, 'x', '40%')
$textContainer.setAttributeNS(null, 'y', '45%')
$textContainer.setAttributeNS(null, 'width', '20%')
$textContainer.setAttributeNS(null, 'height', '20%')
$textContainer.setAttributeNS(null, 'viewBox', '0 0 75 25')
$svgContainer.appendChild($textContainer)

const $problemText = document.createElementNS(SVG_NS, 'text')
$problemText.textContent = `${firstNum} + ${secondNum} =`
$problemText.setAttributeNS(null, 'x', 0)
$problemText.setAttributeNS(null, 'y', 20)
$textContainer.appendChild($problemText)

const $squareGroup = document.createElementNS(SVG_NS, 'svg')
$squareGroup.setAttributeNS(null, 'x', 50)
$squareGroup.setAttributeNS(null, 'y', 3)
$textContainer.appendChild($squareGroup)

const $square = document.createElementNS(SVG_NS, 'rect')
$square.setAttributeNS(null, 'x', 1)
$square.setAttributeNS(null, 'y', 1)
$square.setAttributeNS(null, 'rx', 4)
$square.setAttributeNS(null, 'width', 20)
$square.setAttributeNS(null, 'height', 20)
$square.setAttributeNS(null, 'fill', 'transparent')
$square.setAttributeNS(null, 'stroke', 'LightCoral')
$squareGroup.appendChild($square)

const $squareText = document.createElementNS(SVG_NS, 'text')
$squareText.textContent = '?'
$squareText.setAttributeNS(null, 'fill', 'crimson')
$squareText.setAttributeNS(null, 'text-anchor', 'middle')
$squareText.setAttributeNS(null, 'alignment-baseline', 'middle')
$squareText.setAttributeNS(null, 'transform', 'translate(11, 13)')
$squareText.setAttributeNS(null, 'class', 'square-text')
$squareGroup.appendChild($squareText)



const $incorrectToast = document.createElementNS(SVG_NS, 'svg')
$incorrectToast.setAttributeNS(null, 'x', 30)
$incorrectToast.setAttributeNS(null, 'y', 450)
$incorrectToast.setAttributeNS(null, 'width', 250)
$incorrectToast.setAttributeNS(null, 'height', 40)
$incorrectToast.setAttributeNS(null, 'class', 'incorrect-toast')
$svgContainer.appendChild($incorrectToast)

const $incorrectToastOuter = document.createElementNS(SVG_NS, 'rect')
$incorrectToastOuter.setAttributeNS(null, 'x', 0)
$incorrectToastOuter.setAttributeNS(null, 'y', 0)
$incorrectToastOuter.setAttributeNS(null, 'rx', 4)
$incorrectToastOuter.setAttributeNS(null, 'width', 250)
$incorrectToastOuter.setAttributeNS(null, 'height', 40)
$incorrectToastOuter.setAttributeNS(null, 'fill', 'crimson')
$incorrectToast.appendChild($incorrectToastOuter)

const $incorrectToastText = document.createElementNS(SVG_NS, 'text')
$incorrectToastText.textContent = INCORRECT_MSG
$incorrectToastText.setAttributeNS(null, 'fill', 'white')
$incorrectToastText.setAttributeNS(null, 'font-weight', 'bold')
$incorrectToastText.setAttributeNS(null, 'alignment-baseline', 'middle')
$incorrectToastText.setAttributeNS(null, 'transform', 'translate(18, 22)')
$incorrectToast.appendChild($incorrectToastText)



const $answerContainer = document.createElementNS(SVG_NS, 'svg')
$answerContainer.setAttributeNS(null, 'x', '20%')
$answerContainer.setAttributeNS(null, 'y', '75%')
// $answerContainer.setAttributeNS(null, 'width', '20%')
// $answerContainer.setAttributeNS(null, 'height', '20%')
// $answerContainer.setAttributeNS(null, 'viewBox', '0 0 75 25')
$svgContainer.appendChild($answerContainer)

for (let i = 0; i < 10; i++) {
  const $buttonGroup = document.createElementNS(SVG_NS, 'svg')
  $buttonGroup.setAttributeNS(null, 'x', 48 * i)
  $buttonGroup.setAttributeNS(null, 'y', 0)
  $buttonGroup.setAttributeNS(null, 'width', 40)
  $buttonGroup.setAttributeNS(null, 'height', 40)
  $buttonGroup.setAttributeNS(null, 'data-value', i)
  $buttonGroup.setAttributeNS(null, 'class', 'number-btn-outer')
  $answerContainer.appendChild($buttonGroup)
  
  const $buttonOuter = document.createElementNS(SVG_NS, 'rect')
  $buttonOuter.setAttributeNS(null, 'x', 1)
  $buttonOuter.setAttributeNS(null, 'y', 1)
  $buttonOuter.setAttributeNS(null, 'rx', 8)
  $buttonOuter.setAttributeNS(null, 'width', 38)
  $buttonOuter.setAttributeNS(null, 'height', 38)
  $buttonOuter.setAttributeNS(null, 'fill', 'white')
  $buttonOuter.setAttributeNS(null, 'stroke', 'SkyBlue')
  $buttonOuter.setAttributeNS(null, 'stroke-width', 2)
  $buttonGroup.appendChild($buttonOuter)
  
  const $buttonText = document.createElementNS(SVG_NS, 'text')
  $buttonText.textContent = i
  $buttonText.setAttributeNS(null, 'font-size', '1.5rem')
  $buttonText.setAttributeNS(null, 'fill', 'SteelBlue')
  $buttonText.setAttributeNS(null, 'text-anchor', 'middle')
  $buttonText.setAttributeNS(null, 'alignment-baseline', 'middle')
  $buttonText.setAttributeNS(null, 'transform', 'translate(20, 23)')
  $buttonGroup.appendChild($buttonText)

  $buttonGroup.addEventListener('click', buttonHandler)
}