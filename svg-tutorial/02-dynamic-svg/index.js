const MSG_TITLE = '🔈 다음 덧셈을 하세요.'
const TITLE_INTRO = '더하기'
const TITLE_CORRECT = '와우! 잘했어요!'
const TITLE_FAILED = '조금 아쉬워요!'
const MSG_INCORRECT_TOAST = '저런! 다시 생각해볼까요?'
const CONTENT_INTRO = '한 자리 숫자끼리 더해볼까요?'
const CONTENT_CORRECT = '다음 문제도 풀어볼까요?'
const CONTENT_FAILED = '다시 한 번 풀어볼까요?'
const BTN_TEXT_CUSTOM = '입력한 숫자로 시작'
const BTN_TEXT_RANDOM_1 = '랜덤 숫자 (두 번째 숫자는 무조건 1)'
const BTN_TEXT_RANDOM_2 = '랜덤 숫자'
const BTN_TEXT_RESTART = '풀어볼래요!'

const MAX_LEFT_CNT = 3
const TOAST_TIME = 1000
const SVG_WIDTH = 800
const SVG_HEIGHT = 500

let firstNum, secondNum, isChecked, leftCnt
let isSecondNumAlwaysOne = false
let toastTimeoutId = null, fadeTimeoutId = null
let introErrorMessage = ''

/**
 * SVG 요소를 생성 & 리턴
 */
const createSVGElement = ({ type = 'svg', parent, text = '', attributes }) => {
  const SVG_NS = 'http://www.w3.org/2000/svg'

  const $el = document.createElementNS(SVG_NS, type)
  if (type === 'text') $el.textContent = text

  for (const [key, value] of Object.entries(attributes))
    $el.setAttributeNS(null, key, value)

  parent.appendChild($el)
  return $el
}

/**
 * 모달 표시
 */
const showModal = ({ title, isIntro, content, buttons }) => {
  let firstNumCandidate = 1, secondNumCandidate = 1

  const $modalOverlay = document.createElement('div')
  $modalOverlay.className = 'modal-overlay'
  document.getElementById('container').appendChild($modalOverlay)

  const $modalContiainer = document.createElement('section')
  $modalContiainer.classList = 'modal-container'
  $modalOverlay.appendChild($modalContiainer)

  const $modalTitle = document.createElement('h1')
  $modalTitle.innerText = title
  $modalContiainer.appendChild($modalTitle)

  const $modalContent = document.createElement('p')
  $modalContent.innerText = content
  $modalContiainer.appendChild($modalContent)

  if (isIntro) {
    const $numInputContainer = document.createElement('div')
    $numInputContainer.classList = 'num-input-container'
    $modalContiainer.appendChild($numInputContainer)

    const $firstNumInput = document.createElement('input')
    $firstNumInput.classList = 'num-input'
    $firstNumInput.type = 'number'
    $firstNumInput.min = '1'
    $firstNumInput.max = '8'
    $firstNumInput.value = '1'
    $numInputContainer.appendChild($firstNumInput)
    $firstNumInput.addEventListener('keyup', e => {
      if (e.target.value.length > 1) e.target.value = e.key
      firstNumCandidate = +e.key
    })
    $firstNumInput.addEventListener('change', e => {
      firstNumCandidate = +e.target.value
    })

    const $plusOp = document.createTextNode('+')
    $numInputContainer.appendChild($plusOp)

    const $secondNumInput = document.createElement('input')
    $secondNumInput.classList = 'num-input'
    $secondNumInput.type = 'number'
    $secondNumInput.min = '1'
    $secondNumInput.max = '8'
    $secondNumInput.value = '1'
    $numInputContainer.appendChild($secondNumInput)
    $secondNumInput.addEventListener('keyup', e => {
      if (e.target.value.length > 1) e.target.value = e.key
      secondNumCandidate = +e.key
    })
    $secondNumInput.addEventListener('change', e => {
      secondNumCandidate = +e.target.value
    })

    const $introErrorMessage = document.createElement('p')
    $introErrorMessage.classList = 'intro-error-message'
    $introErrorMessage.innerText = introErrorMessage
    $modalContiainer.appendChild($introErrorMessage)
  }

  const $modalButtonContainer = document.createElement('div')
  $modalButtonContainer.classList = 'modal-button-container'
  $modalContiainer.appendChild($modalButtonContainer)

  for (const { text, action } of buttons) {
    const $modalButton = document.createElement('button')
    $modalButton.innerText = text
    $modalButtonContainer.appendChild($modalButton)
    $modalButton.addEventListener('click', () => {
      action(firstNumCandidate, secondNumCandidate)
    })
  }

  fadeTimeoutId = setTimeout(() => {
    $modalOverlay.classList.add('visible')
    clearTimeout(fadeTimeoutId)
  }, 10)
}

/**
 * 모달 숨기기
 */
const hideModal = () => {
  const $modalOverlay = document.querySelector('.modal-overlay')
  $modalOverlay.classList.remove('visible')
  fadeTimeoutId = setTimeout(() => {
    $modalOverlay.remove()
    clearTimeout(fadeTimeoutId)
  }, 250)
}

/**
 * 토스트 메시지 띄우기
 */
const showToast = () => {
  document.querySelector('.incorrect-toast').classList.add('visible')
  toastTimeoutId = setTimeout(() => {
    document.querySelector('.incorrect-toast').classList.remove('visible')
    clearTimeout(toastTimeoutId)
  }, TOAST_TIME)
}

/**
 * 인트로 모달 에러 메시지 수정
 */
const setIntroErrorMessage = msg => {
  const $introErrorMessage = document.querySelector('.intro-error-message')
  $introErrorMessage.innerText = msg
}

/**
 * 숫자 버튼 클릭 이벤트 핸들러
 */
const buttonHandler = ({ target }) => {
  const myAnswer = +target.parentNode.dataset.value

  if (isChecked[myAnswer]) return
  if (firstNum + secondNum === myAnswer) {
    const $squareText = document.querySelector('.square-text')
    $squareText.textContent = myAnswer
    $squareText.classList.add('corrected')

    showModal({
      title: TITLE_CORRECT,
      content: CONTENT_CORRECT,
      buttons: [
        {
          text: BTN_TEXT_RESTART,
          action() {
            const firstNumCandidate = ~~(Math.random() * 8) + 1
            const secondNumCandidate = isSecondNumAlwaysOne ? 1 : ~~(Math.random() * (9 - firstNumCandidate)) + 1

            hideModal()
            init(firstNumCandidate, secondNumCandidate)
          }
        }
      ]
    })
  } else {
    leftCnt--
    document.getElementsByClassName('number-btn-outer')[myAnswer].classList.add('incorrected')
    isChecked[myAnswer] = true
    
    if (leftCnt === 0) {
      showModal({
        title: TITLE_FAILED,
        content: CONTENT_FAILED,
        buttons: [
          {
            text: BTN_TEXT_RESTART,
            action() {
              const firstNumCandidate = ~~(Math.random() * 8) + 1
              const secondNumCandidate = isSecondNumAlwaysOne ? 1 : ~~(Math.random() * (9 - firstNumCandidate)) + 1

              hideModal()
              init(firstNumCandidate, secondNumCandidate)
            }
          }
        ]
      })
    } else {
      showToast()
    }
  }
}

/**
 * 변수 초기화 및 SVG 화면 렌더링
 */
const init = (firstNumCandidate, secondNumCandidate) => {
  let $svgContainer = document.getElementById('svg-container')
  if ($svgContainer) $svgContainer.remove()

  firstNum = firstNumCandidate
  secondNum = secondNumCandidate
  isChecked = Array(10).fill(false)
  leftCnt = MAX_LEFT_CNT

  $svgContainer = createSVGElement({
    type: 'svg',
    parent: document.getElementById('container'),
    attributes: {
      width: SVG_WIDTH,
      height: SVG_HEIGHT,
      id: 'svg-container'
    }
  })

  createSVGElement({
    type: 'text',
    parent: $svgContainer,
    text: MSG_TITLE,
    attributes: {
      x: 30,
      y: 50,
      'font-size': '1.25rem'
    }
  })
  
  const $imageContainer = createSVGElement({
    type: 'svg',
    parent: $svgContainer,
    attributes: {
      x: 340 - 18 * (firstNum + secondNum - 2),
      y: 20,
      width: '50%',
      height: '50%',
      viewBox: '0 0 230 40'
    }
  })
  
  createSVGElement({
    type: 'rect',
    parent: $imageContainer,
    attributes: {
      x: 10,
      y: 20,
      rx: 10,
      width: 20 * firstNum,
      height: 20,
      fill: 'transparent',
      stroke: 'skyblue'
    }
  })
  
  for (let i = 0; i < firstNum; i++) {
    createSVGElement({
      type: 'circle',
      parent: $imageContainer,
      attributes: {
        cx: 20 * (i + 1),
        cy: 30,
        r: 4,
        fill: 'lightcoral'
      }
    })
  }
  
  createSVGElement({
    type: 'rect',
    parent: $imageContainer,
    attributes: {
      x: 20 * (firstNum + 1),
      y: 20,
      rx: 10,
      width: 20 * secondNum,
      height: 20,
      fill: 'transparent',
      stroke: 'skyblue'
    }
  })
  
  for (let i = 0; i < secondNum; i++) {
    createSVGElement({
      type: 'circle',
      parent: $imageContainer,
      attributes: {
        cx: 20 * (firstNum + 1.5 + i),
        cy: 30,
        r: 4,
        fill: 'mediumslateblue'
      }
    })
  }
  
  createSVGElement({
    type: 'path',
    parent: $imageContainer,
    attributes: {
      d: `M ${20 * firstNum} 20 c 0 -15, 30 -15, 30 0`,
      fill: 'transparent',
      stroke: 'skyblue'
    }
  })
  
  const $problemTextContainer = createSVGElement({
    type: 'svg',
    parent: $svgContainer,
    attributes: {
      x: '40%',
      y: '45%',
      width: '20%',
      height: '20%',
      viewBox: '0 0 75 25'
    }
  })
  
  createSVGElement({
    type: 'text',
    parent: $problemTextContainer,
    text: `${firstNum} + ${secondNum} =`,
    attributes: {
      x: 0,
      y: 20
    }
  })
  
  const $squareGroup = createSVGElement({
    type: 'svg',
    parent: $problemTextContainer,
    attributes: {
      x: 50,
      y: 3
    }
  })
  
  createSVGElement({
    type: 'rect',
    parent: $squareGroup,
    attributes: {
      x: 1,
      y: 1,
      rx: 4,
      width: 20,
      height: 20,
      fill: 'transparent',
      stroke: 'lightcoral'
    }
  })
  
  createSVGElement({
    type: 'text',
    parent: $squareGroup,
    text: '?',
    attributes: {
      fill: 'crimson',
      'text-anchor': 'middle',
      'alignment-baseline': 'middle',
      transform: 'translate(11, 13)',
      class: 'square-text'
    }
  })
  
  const $incorrectToast = createSVGElement({
    type: 'svg',
    parent: $svgContainer,
    attributes: {
      x: 30,
      y: 450,
      width: 250,
      height: 40,
      class: 'incorrect-toast'
    }
  })
  
  createSVGElement({
    type: 'rect',
    parent: $incorrectToast,
    attributes: {
      x: 0,
      y: 0,
      rx: 4,
      width: 250,
      height: 40,
      fill: 'crimson'
    }
  })
  
  createSVGElement({
    type: 'text',
    parent: $incorrectToast,
    text: MSG_INCORRECT_TOAST,
    attributes: {
      fill: 'white',
      'font-weight': 'bold',
      'alignment-baseline': 'middle',
      transform: 'translate(18, 22)'
    }
  })
  
  const $answerContainer = createSVGElement({
    type: 'svg',
    parent: $svgContainer,
    attributes: {
      x: '20%',
      y: '75%'
    }
  })
  
  for (let i = 0; i < 10; i++) {
    const $buttonGroup = createSVGElement({
      type: 'svg',
      parent: $answerContainer,
      attributes: {
        x: 48 * i,
        y: 0,
        width: 40,
        height: 40,
        'data-value': i,
        class: 'number-btn-outer'
      }
    })
    
    createSVGElement({
      type: 'rect',
      parent: $buttonGroup,
      attributes: {
        x: 1,
        y: 1,
        rx: 8,
        width: 38,
        height: 38,
        fill: 'white',
        stroke: 'skyblue',
        'stroke-width': 2
      }
    })
    
    createSVGElement({
      type: 'text',
      parent: $buttonGroup,
      text: i,
      attributes: {
        'font-size': '1.5rem',
        fill: 'steelblue',
        'text-anchor': 'middle',
        'alignment-baseline': 'middle',
        transform: 'translate(20, 23)'
      }
    })
  
    $buttonGroup.addEventListener('click', buttonHandler)
  }
}

showModal({
  title: TITLE_INTRO,
  content: CONTENT_INTRO,
  isIntro: true,
  buttons: [
    {
      text: BTN_TEXT_CUSTOM,
      action(firstNumCandidate, secondNumCandidate) {
        if (Number.isNaN(firstNumCandidate) || Number.isNaN(secondNumCandidate)) {
          setIntroErrorMessage('오직 숫자만 입력해주세요.')
          return
        }
        if (firstNumCandidate + secondNumCandidate > 9) {
          setIntroErrorMessage('두 수의 합이 한 자리 수를 넘을 수 없어요.')
          return
        }
        if (firstNumCandidate < 1 || secondNumCandidate < 1) {
          setIntroErrorMessage('1에서 8 사이의 수만 입력해주세요.')
          return
        }

        hideModal()
        init(firstNumCandidate, secondNumCandidate)
      }
    },
    {
      text: BTN_TEXT_RANDOM_1,
      action() {
        const firstNumCandidate = ~~(Math.random() * 8) + 1
        isSecondNumAlwaysOne = true
        
        hideModal()
        init(firstNumCandidate, 1)
      }
    },
    {
      text: BTN_TEXT_RANDOM_2,
      action() {
        const firstNumCandidate = ~~(Math.random() * 8) + 1
        const secondNumCandidate = ~~(Math.random() * (9 - firstNumCandidate)) + 1

        hideModal()
        init(firstNumCandidate, secondNumCandidate)
      }
    }
  ]
})