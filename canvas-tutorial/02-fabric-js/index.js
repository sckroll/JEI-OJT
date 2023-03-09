import { speakText, deg2Rad } from './utils.js'

const TITLE_QUESTION_1 = '삼각형을 찾아 고르세요.'
const TITLE_QUESTION_2 = '삼각형을 모두 찾아 고르세요.'
const TITLE_MODAL_INCORRECT = '조금 아쉬워요!'
const TITLE_MODAL_CORRECT = '와우! 잘했어요!'
const MSG_MODAL_BUTTON = '다시 할래요!'

const SRC_CLICK_SOUND = './mp3/MP_Blop.mp3'
const SRC_CORRECT_SOUND = './mp3/MP_스테이지 클리어 (레트로).mp3'
const COLORS = ['red', 'royalblue', 'green', 'grey', 'magenta', 'gold', 'yellowgreen', 'skyblue']

const CANVAS_MARGIN = 200
const TOTAL_LEVEL = 2
const MAX_INCORRECT_COUNT = 3

let currLevel = 0, tooltipTimeoutId = null, levelSwitchTimeoutId = null

const clickSound = new Audio(SRC_CLICK_SOUND)
const correctSound = new Audio(SRC_CORRECT_SOUND)
correctSound.volume = 0.4

/**
 * 캔버스 HTML 요소 생성
 */
const initContainer = () => {
  const $container = document.getElementById('container')
  const $canvas = document.createElement('canvas')
  
  $canvas.id = 'canvas'
  $canvas.width = $container.clientWidth
  $canvas.height = $container.clientHeight
  $container.appendChild($canvas)
}

/**
 * 좌측 상단 타이틀 렌더링
 */
const renderTitle = (canvas, text) => {
  const titleIcon = new fabric.Text('🔈', {
    originY: 'center',
    hoverCursor: 'pointer'
  })
  const titleText = new fabric.Text(text, {
    left: 50,
    fontSize: 24,
    originY: 'center',
  })
  const title = new fabric.Group([titleIcon, titleText], {
    top: 20,
    left: 20,
    selectable: false,
    subTargetCheck: true,
    hoverCursor: 'default'
  })
  canvas.add(title)
  titleIcon.on('mousedown', () => speakText(text))

  return title
}

/**
 * 우측 상단 현재 단계 상태 렌더링
 */
const renderLevelIndicator = canvas => {
  const checkIconPath = 'M 0 0 l 10 10 l 20 -20 l 5 5 l -25 25 l -15 -15 z'

  const levelIndicatorGroup = new fabric.Group([], {
    selectable: false,
    hoverCursor: 'default'
  })
  for (let i = 0; i < TOTAL_LEVEL; i++) {
    levelIndicatorGroup.addWithUpdate(new fabric.Path(checkIconPath, {
      left: 64 * i,
      fill: 'transparent',
      stroke: 'black',
      strokeWidth: 2
    }))
  }
  levelIndicatorGroup.set({ top: 30, left: canvas.width - levelIndicatorGroup.width - 30 })
  canvas.add(levelIndicatorGroup)

  return levelIndicatorGroup
}

/**
 * 도형이 다른 도형과 충돌(Collision)하는지 여부를 판단
 */
const isShapeCollided = (canvas, shape) => {
  let result = false
  const { left, top, width, height } = shape.getBoundingRect()

  if (left < 0 || top < 0 || left + width > canvas.width || top + height > canvas.height) result = true
  canvas.forEachObject(obj => {
    if (shape.intersectsWithObject(obj)) result = true
  })

  return result
}

/**
 * 삼각형, 사각형, 원, 패스 중 하나를 무작위로 렌더링
 */
const renderRandomShape = (canvas, shapeCount, minTriangleCount = 1) => {
  const shapes = []
  let triangleCount = 0

  for (let i = 0; i < shapeCount; i++) {
    const isFixed = i === shapeCount - (minTriangleCount - triangleCount) && minTriangleCount > triangleCount
    const randomNumber = isFixed ? 0 : ~~(Math.random() * 4)
    let shape = null

    if (randomNumber <= 1) {
      // 삼각형 (0) & 패스 (1)
      const x1 = ~~(Math.random() * (canvas.width - CANVAS_MARGIN * 2)) + CANVAS_MARGIN
      const y1 = ~~(Math.random() * (canvas.height - CANVAS_MARGIN * 2)) + CANVAS_MARGIN
      const x2 = (~~(Math.random() * 2) === 0 ? 1 : -1) * (~~(Math.random() * 100) + 50)
      const y2 = (~~(Math.random() * 2) === 0 ? 1 : -1) * (~~(Math.random() * 100) + 50)
      const x3 = Math.cos(Math.atan2(y2, x2) + deg2Rad(~~(Math.random() * 60) + 60)) * (~~(Math.random() * 100) + 50)
      const y3 = Math.sin(Math.atan2(y2, x2) + deg2Rad(~~(Math.random() * 60) + 60)) * (~~(Math.random() * 100) + 50)

      shape = new fabric.Path(`M ${x1} ${y1} l ${x2} ${y2} l ${x3} ${y3}${randomNumber === 0 ? ' z' : ''}`, {
        fill: 'transparent',
        stroke: COLORS[i],
        strokeWidth: 2,
        selectable: false,
        isTriangle: randomNumber === 0
      })
    } else if (randomNumber === 2) {
      // 사각형 (2)
      const x1 = ~~(Math.random() * (canvas.width - CANVAS_MARGIN * 2)) + CANVAS_MARGIN
      const y1 = ~~(Math.random() * (canvas.height - CANVAS_MARGIN * 2)) + CANVAS_MARGIN
      const x2 = (~~(Math.random() * 2) === 0 ? 1 : -1) * (~~(Math.random() * 100) + 50)
      const y2 = (~~(Math.random() * 2) === 0 ? 1 : -1) * (~~(Math.random() * 100) + 50)
      const x3 = Math.cos(Math.atan2(y2, x2) + deg2Rad(~~(Math.random() * 70) + 30)) * (~~(Math.random() * 100) + 50)
      const y3 = Math.sin(Math.atan2(y2, x2) + deg2Rad(~~(Math.random() * 70) + 30)) * (~~(Math.random() * 100) + 50)
      const x4 = Math.cos(Math.atan2(y3, x3) + deg2Rad(~~(Math.random() * 70) + 30)) * (~~(Math.random() * 100) + 50)
      const y4 = Math.sin(Math.atan2(y3, x3) + deg2Rad(~~(Math.random() * 70) + 30)) * (~~(Math.random() * 100) + 50)

      shape = new fabric.Path(`M ${x1} ${y1} l ${x2} ${y2} l ${x3} ${y3} l ${x4} ${y4} z`, {
        fill: 'transparent',
        stroke: COLORS[i],
        strokeWidth: 2,
        selectable: false,
        isTriangle: false
      })
    } else if (randomNumber === 3) {
      // 원 (3)
      const left = ~~(Math.random() * (canvas.width - CANVAS_MARGIN)) + 100
      const top = ~~(Math.random() * (canvas.height - CANVAS_MARGIN)) + 100
      const radius = ~~(Math.random() * 50) + 50

      shape = new fabric.Circle({
        left,
        top,
        radius,
        fill: 'transparent',
        stroke: COLORS[i],
        strokeWidth: 2,
        selectable: false,
        isTriangle: false
      })
    }

    // 도형 일부가 뷰포트 밖으로 나가거나 다른 도형과 충돌할 경우 재배치
    if (isShapeCollided(canvas, shape)) {
      i--
      continue
    }

    // 삼각형 개수 업데이트
    if (randomNumber === 0) triangleCount++

    canvas.add(shape)
    shapes.push(shape)
  }

  return shapes
}

/**
 * 툴팁 렌더링
 */
const renderTooltip = (canvas, top, left, isCorrected) => {
  const tooltipBackground = new fabric.Rect({
    width: 48,
    height: 48,
    rx: 8,
    fill: isCorrected ? 'green' : 'crimson',
    originX: 'center',
    originY: 'center'
  })
  const correctShape = new fabric.Circle({
    radius: 16,
    fill: 'transparent',
    stroke: 'white',
    strokeWidth: 4,
    originX: 'center',
    originY: 'center'
  })
  const incorrectShape = new fabric.Path('M -16 -16 l 32 32 m 0 -32 l -32 32', {
    fill: 'transparent',
    stroke: 'white',
    strokeWidth: 4,
    originX: 'center',
    originY: 'center'
  })
  const tooltip = new fabric.Group([tooltipBackground, correctShape, incorrectShape], {
    top,
    left,
    selectable: false,
    hoverCursor: 'default',
    opacity: 0
  })
  
  tooltip.removeWithUpdate(isCorrected ? incorrectShape : correctShape)
  canvas.add(tooltip)

  // 툴팁 애니메이션 적용
  tooltip.animate('opacity', 1, {
    onChange() {
      canvas.renderAll()
    },
    duration: 150
  })
  tooltipTimeoutId = setTimeout(() => {
    tooltip.animate('opacity', 0, {
      onChange() {
        canvas.renderAll()
      },
      onComplete() {
        canvas.remove(tooltip)
      },
      duration: 150
    })
    clearTimeout(tooltipTimeoutId)
  }, 500)
}

/**
 * 모달 창 렌더링
 */
const renderModal = (canvas, titleText, buttonText, onClick) => {
  const overlay = new fabric.Rect({
    width: canvas.width,
    height: canvas.height,
    fill: 'rgba(0, 0, 0, 0.3)',
    originX: 'center',
    originY: 'center'
  })
  const modalContainer = new fabric.Rect({
    width: canvas.width / 3,
    height: canvas.height / 3,
    rx: 32,
    fill: 'white',
    originX: 'center',
    originY: 'center'
  })
  const modalTitle = new fabric.Text(titleText, {
    top: -32,
    fontSize: 28,
    originX: 'center',
    originY: 'center'
  })
  const buttonBackground = new fabric.Rect({
    width: canvas.width / 4,
    height: 48,
    rx: 8,
    fill: 'green',
    originX: 'center',
    originY: 'center'
  })
  const buttonForeground = new fabric.Text(buttonText, {
    fontSize: 18,
    fill: 'white',
    originX: 'center',
    originY: 'center'
  })
  const buttonGroup = new fabric.Group([buttonBackground, buttonForeground], {
    top: 32,
    hoverCursor: 'pointer',
    originX: 'center',
    originY: 'center'
  })
  const modalGroup = new fabric.Group([overlay, modalContainer, modalTitle, buttonGroup], {
    top: 0,
    left: 0,
    selectable: false,
    subTargetCheck: true,
    hoverCursor: 'default'
  })
  canvas.add(modalGroup)

  buttonGroup.on('mousedown', onClick)
  buttonGroup.on('mouseover', () => {
    buttonGroup.animate({ scaleX: 1.05, scaleY: 1.05 }, {
      onChange() {
        canvas.renderAll()
      },
      duration: 100
    })
  })
  buttonGroup.on('mouseout', () => {
    buttonGroup.animate({ scaleX: 0.95, scaleY: 0.95 }, {
      onChange() {
        canvas.renderAll()
      },
      duration: 100
    })
  })

  return modalGroup
}

/**
 * Fabric.js 캔버스 초기화
 */
const initCanvas = () => {
  const canvas = new fabric.Canvas('canvas', {
    selection: false,
    hoverCursor: 'pointer'
  })

  const levelIndicatorGroup = renderLevelIndicator(canvas)
  let title = null, shapes = null, modal = null

  const renderSuccessModal = () => {
    speakText(TITLE_MODAL_CORRECT)
    modal = renderModal(canvas, TITLE_MODAL_CORRECT, MSG_MODAL_BUTTON, () => {
      currLevel = 0
      for (let i = 0; i < TOTAL_LEVEL; i++) {
        levelIndicatorGroup.item(i).set({ fill: 'transparent' })
      }

      canvas.remove(title, modal, ...shapes)
      renderLevel1(renderLevel2, renderFailureModal)
    })
  }
  const renderFailureModal = () => {
    speakText(TITLE_MODAL_INCORRECT)
    modal = renderModal(canvas, TITLE_MODAL_INCORRECT, MSG_MODAL_BUTTON, () => {
      currLevel = 0
      for (let i = 0; i < TOTAL_LEVEL; i++) {
        levelIndicatorGroup.item(i).set({ fill: 'transparent' })
      }

      canvas.remove(title, modal, ...shapes)
      renderLevel1(renderLevel2, renderFailureModal)
    })
  }
  const onMouseOver = ({ target }) => {
    target.animate('opacity', 0.3, {
      onChange() {
        canvas.renderAll()
      },
      duration: 150
    })
  }
  const onMouseOut = ({ target }) => {
    target.animate('opacity', 1, {
      onChange() {
        canvas.renderAll()
      },
      duration: 150
    })
  }
  const enableShapeEvents = (shape, onClick) => {
    shape.on('mousedown', onClick)
    shape.on('mouseover', onMouseOver)
    shape.on('mouseout', onMouseOut)
  }
  const disableShapeEvents = (shape, onClick) => {
    shape.off('mousedown', onClick)
    shape.off('mouseover', onMouseOver)
    shape.off('mouseout', onMouseOut)
    shape.set({ hoverCursor: 'default' })
  }

  const renderLevel1 = (onSuccess, onFailure) => {
    let incorrectCount = 0
    title = renderTitle(canvas, TITLE_QUESTION_1)
    shapes = renderRandomShape(canvas, 8)

    for (const shape of shapes) {
      const shapeClickHandler = ({ target }) => {
        const { left, top, width } = target.getBoundingRect()

        if (target.isTriangle) {
          levelIndicatorGroup.item(currLevel++).set({ fill: 'black' })
          correctSound.play()
          levelSwitchTimeoutId = setTimeout(() => {
            canvas.remove(title, ...shapes)
            onSuccess(renderSuccessModal, onFailure)
            clearTimeout(levelSwitchTimeoutId)
          }, 1000)
        } else {
          clickSound.play()
          incorrectCount++
          disableShapeEvents(shape, shapeClickHandler)
        }
        renderTooltip(canvas, top - 48, left + width, target.isTriangle)

        if (incorrectCount === MAX_INCORRECT_COUNT) onFailure()
      }
      enableShapeEvents(shape, shapeClickHandler)
    }
  }
  const renderLevel2 = (onSuccess, onFailure) => {
    const totalTriangleCount = 5
    let correctCount = 0, incorrectCount = 0

    title = renderTitle(canvas, TITLE_QUESTION_2)
    shapes = renderRandomShape(canvas, 8, totalTriangleCount)

    for (const shape of shapes) {
      const shapeClickHandler = ({ target }) => {
        const { left, top, width } = target.getBoundingRect()

        if (target.isTriangle) {
          correctSound.play()
          correctCount++
        } else {
          clickSound.play()
          incorrectCount++
          disableShapeEvents(shape, shapeClickHandler)
        }
        renderTooltip(canvas, top - 48, left + width, target.isTriangle)

        if (incorrectCount === MAX_INCORRECT_COUNT) onFailure()
        if (correctCount === totalTriangleCount) {
          levelIndicatorGroup.item(currLevel++).set({ fill: 'black' })
          levelSwitchTimeoutId = setTimeout(() => {
            onSuccess()
            clearTimeout(levelSwitchTimeoutId)
          }, 1000)
        }
      }
      enableShapeEvents(shape, shapeClickHandler)
    }
  }

  renderLevel1(renderLevel2, renderFailureModal)
}

initContainer()
initCanvas()