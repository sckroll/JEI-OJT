import opt from './options.js'
import { showModal, hideModal } from './modal.js'
import { showToast } from './toast.js'

let firstNum, secondNum, isChecked, leftCnt

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
 * 우측 상단 타이틀 렌더링
 */
const renderTitle = parent => {
  createSVGElement({
    type: 'text',
    parent,
    text: opt.MSG_TITLE,
    attributes: {
      x: 30,
      y: 50,
      'font-size': '1.25rem'
    }
  })
}

/**
 * 문제 이미지 렌더링
 */
const renderProblemImage = (parent, firstNum, secondNum) => {
  const $problemImageContainer = createSVGElement({
    type: 'svg',
    parent,
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
    parent: $problemImageContainer,
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
      parent: $problemImageContainer,
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
    parent: $problemImageContainer,
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
      parent: $problemImageContainer,
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
    parent: $problemImageContainer,
    attributes: {
      d: `M ${20 * firstNum} 20 c 0 -15, 30 -15, 30 0`,
      fill: 'transparent',
      stroke: 'skyblue'
    }
  })
}

/**
 * 문제 텍스트 렌더링
 */
const renderProblemText = (parent, firstNum, secondNum) => {
  const $problemTextContainer = createSVGElement({
    type: 'svg',
    parent,
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
}

/**
 * 오답 토스트 메시지 렌더링
 */
const renderToast = parent => {
  const $incorrectToast = createSVGElement({
    type: 'svg',
    parent,
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
    text: opt.MSG_INCORRECT_TOAST,
    attributes: {
      fill: 'white',
      'font-weight': 'bold',
      'alignment-baseline': 'middle',
      transform: 'translate(18, 22)'
    }
  })
}

/**
 * 정답 숫자 버튼 렌더링
 */
const renderAnswerButtons = (parent, clickHandler) => {
  const $answerContainer = createSVGElement({
    type: 'svg',
    parent,
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

    $buttonGroup.addEventListener('click', clickHandler)
  }
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
      title: opt.TITLE_CORRECT,
      content: opt.CONTENT_CORRECT,
      buttons: [
        {
          text: opt.BTN_TEXT_RESTART,
          action() {
            const firstNumCandidate = ~~(Math.random() * 8) + 1
            const secondNumCandidate = secondNum === 1 ? 1 : ~~(Math.random() * (9 - firstNumCandidate)) + 1

            hideModal()
            render(firstNumCandidate, secondNumCandidate)
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
        title: opt.TITLE_FAILED,
        content: opt.CONTENT_FAILED,
        buttons: [
          {
            text: opt.BTN_TEXT_RESTART,
            action() {
              const firstNumCandidate = ~~(Math.random() * 8) + 1
              const secondNumCandidate = secondNum === 1 ? 1 : ~~(Math.random() * (9 - firstNumCandidate)) + 1

              hideModal()
              render(firstNumCandidate, secondNumCandidate)
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
export const render = (firstNumCandidate, secondNumCandidate) => {
  let $svgContainer = document.getElementById('svg-container')
  if ($svgContainer) $svgContainer.remove()

  firstNum = firstNumCandidate
  secondNum = secondNumCandidate
  isChecked = Array(10).fill(false)
  leftCnt = opt.MAX_LEFT_CNT

  $svgContainer = createSVGElement({
    type: 'svg',
    parent: document.getElementById('container'),
    attributes: {
      width: opt.SVG_WIDTH,
      height: opt.SVG_HEIGHT,
      id: 'svg-container'
    }
  })

  renderTitle($svgContainer)
  renderProblemImage($svgContainer, firstNum, secondNum)
  renderProblemText($svgContainer, firstNum, secondNum)
  renderToast($svgContainer)
  renderAnswerButtons($svgContainer, buttonHandler)
}