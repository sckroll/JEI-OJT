import { speakText, deg2Rad } from './utils.js'
import { messages, sources, colors, constants } from './settings.js'

let currLevel = 0, uiTimeoutId = null
const tooltipTimeoutId = Array(constants.SHAPE_COUNT).fill(null)
const animationTimeoutId = Array(constants.SHAPE_COUNT).fill(null)

const clickSound = new Audio(sources.SRC_CLICK_SOUND)
const correctSound = new Audio(sources.SRC_CORRECT_SOUND)
correctSound.volume = 0.4

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
  for (let i = 0; i < constants.TOTAL_LEVEL; i++) {
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
 * 삼각형, 사각형, 원, 패스 중 하나를 무작위로 shapeCount개 렌더링
 * (이때 삼각형은 최소 minTriangleCount개 있어야 함)
 */
const renderRandomShape = (canvas, shapeCount, minTriangleCount = 1) => {
  const shapes = []
  let left, top, triangleCount = 0

  console.time('renderRandomShape')
  for (let i = 0; i < shapeCount; i++) {
    const isFixed = i === shapeCount - (minTriangleCount - triangleCount) && minTriangleCount > triangleCount
    const randomNumber = isFixed ? 0 : ~~(Math.random() * 4)
    let shape = null

    left = ~~(Math.random() * (canvas.width - constants.CANVAS_MARGIN * 2)) + constants.CANVAS_MARGIN
    top = ~~(Math.random() * (canvas.height - constants.CANVAS_MARGIN * 2)) + constants.CANVAS_MARGIN

    if (randomNumber <= 1) {
      // 삼각형 (0) & 패스 (1)
      const x1 = (~~(Math.random() * 2) === 0 ? 1 : -1) * (~~(Math.random() * 100) + 50)
      const y1 = (~~(Math.random() * 2) === 0 ? 1 : -1) * (~~(Math.random() * 100) + 50)
      const x2 = Math.cos(Math.atan2(y1, x1) + deg2Rad(~~(Math.random() * 60) + 60)) * (~~(Math.random() * 100) + 50)
      const y2 = Math.sin(Math.atan2(y1, x1) + deg2Rad(~~(Math.random() * 60) + 60)) * (~~(Math.random() * 100) + 50)

      shape = new fabric.Path(`M 0 0 l ${x1} ${y1} l ${x2} ${y2}${randomNumber === 0 ? ' z' : ''}`, {
        left,
        top,
        opacity: 0,
        fill: 'transparent',
        stroke: colors[i],
        strokeWidth: 2,
        selectable: false,
        isTriangle: randomNumber === 0
      })
    } else if (randomNumber === 2) {
      // 사각형 (2)
      const x1 = (~~(Math.random() * 2) === 0 ? 1 : -1) * (~~(Math.random() * 100) + 50)
      const y1 = (~~(Math.random() * 2) === 0 ? 1 : -1) * (~~(Math.random() * 100) + 50)
      const x2 = Math.cos(Math.atan2(y1, x1) + deg2Rad(~~(Math.random() * 70) + 30)) * (~~(Math.random() * 100) + 50)
      const y2 = Math.sin(Math.atan2(y1, x1) + deg2Rad(~~(Math.random() * 70) + 30)) * (~~(Math.random() * 100) + 50)
      const x3 = Math.cos(Math.atan2(y2, x2) + deg2Rad(~~(Math.random() * 70) + 30)) * (~~(Math.random() * 100) + 50)
      const y3 = Math.sin(Math.atan2(y2, x2) + deg2Rad(~~(Math.random() * 70) + 30)) * (~~(Math.random() * 100) + 50)

      shape = new fabric.Path(`M 0 0 l ${x1} ${y1} l ${x2} ${y2} l ${x3} ${y3} z`, {
        left,
        top,
        opacity: 0,
        fill: 'transparent',
        stroke: colors[i],
        strokeWidth: 2,
        selectable: false,
        isTriangle: false
      })
    } else if (randomNumber === 3) {
      // 원 (3)
      const radius = ~~(Math.random() * 50) + 50

      shape = new fabric.Circle({
        left,
        top,
        radius,
        opacity: 0,
        fill: 'transparent',
        stroke: colors[i],
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
  console.timeEnd('renderRandomShape')

  // 도형 하나씩 페이드인
  for (let i = 0; i < shapeCount; i++) {
    animationTimeoutId[i] = setTimeout(() => {
      shapes[i].animate('opacity', 1, {
        onChange() {
          canvas.renderAll()
        },
        onComplete() {
          clearTimeout(animationTimeoutId[i])
          animationTimeoutId[i] = null
        },
        duration: 250
      })
    }, 150 * i)
  }

  return shapes
}

/**
 * 툴팁 렌더링
 */
const renderTooltip = (canvas, top, left, isCorrected, index) => {
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
  tooltipTimeoutId[index] = setTimeout(() => {
    tooltip.animate('opacity', 0, {
      onChange() {
        canvas.renderAll()
      },
      onComplete() {
        canvas.remove(tooltip)
        clearTimeout(tooltipTimeoutId[index])
        tooltipTimeoutId[index] = null
      },
      duration: 150
    })
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
    opacity: 0,
    selectable: false,
    subTargetCheck: true,
    hoverCursor: 'default'
  })
  canvas.add(modalGroup)

  buttonGroup.on('mousedown', () => {
    modalGroup.animate('opacity', 0, {
      onChange() {
        canvas.renderAll()
      },
      duration: 150
    })
    uiTimeoutId = setTimeout(() => {
      onClick()
      clearTimeout(uiTimeoutId)
    }, 150)
    clickSound.play()
  })
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

  modalGroup.animate('opacity', 1, {
    onChange() {
      canvas.renderAll()
    },
    duration: 150
  })

  return modalGroup
}

/**
 * Fabric.js 캔버스 초기화
 */
export const initCanvas = () => {
  const canvas = new fabric.Canvas('canvas', {
    selection: false,
    hoverCursor: 'pointer'
  })

  const levelIndicatorGroup = renderLevelIndicator(canvas)
  let title = null, shapes = null, modal = null

  const renderModalWithTTS = text => {
    speakText(text)
    modal = renderModal(canvas, text, messages.MSG_MODAL_BUTTON, () => {
      currLevel = 0
      for (let i = 0; i < constants.TOTAL_LEVEL; i++) {
        levelIndicatorGroup.item(i).set({ fill: 'transparent' })
      }

      canvas.remove(title, modal, ...shapes)
      renderLevel1(renderLevel2, () => renderModalWithTTS(messages.TITLE_MODAL_INCORRECT))
    })
  }
  const onMouseOver = ({ target }) => {
    target?.animate('opacity', 0.3, {
      onChange() {
        canvas.renderAll()
      },
      duration: 150
    })
  }
  const onMouseOut = ({ target }) => {
    target?.animate('opacity', 1, {
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
    title = renderTitle(canvas, messages.TITLE_QUESTION_1)
    shapes = renderRandomShape(canvas, constants.SHAPE_COUNT)

    for (let i = 0; i < shapes.length; i++) {
      const shapeClickHandler = ({ target, e }) => {
        if (target.isTriangle) {
          if (currLevel === 0) levelIndicatorGroup.item(currLevel++).set({ fill: 'black' })
          correctSound.play()
          uiTimeoutId = setTimeout(() => {
            canvas.remove(title, ...shapes)
            onSuccess(() => renderModalWithTTS(messages.TITLE_MODAL_CORRECT), onFailure)
            clearTimeout(uiTimeoutId)
          }, 1000)
        } else {
          clickSound.play()
          incorrectCount++
        }
        disableShapeEvents(shapes[i], shapeClickHandler)
        renderTooltip(canvas, e.clientY - 64, e.clientX + 16, target.isTriangle, i)

        if (incorrectCount === constants.MAX_INCORRECT_COUNT) onFailure()
      }
      enableShapeEvents(shapes[i], shapeClickHandler)
    }
  }
  const renderLevel2 = (onSuccess, onFailure) => {
    const totalTriangleCount = 5
    let correctCount = 0, incorrectCount = 0

    title = renderTitle(canvas, messages.TITLE_QUESTION_2)
    shapes = renderRandomShape(canvas, constants.SHAPE_COUNT, totalTriangleCount)

    for (let i = 0; i < shapes.length; i++) {
      const shapeClickHandler = ({ target, e }) => {
        if (target.isTriangle) {
          correctSound.load()
          correctSound.play()
          correctCount++
          target.animate({
            top: 20, left: canvas.width / 3 + correctCount * 75, scaleX: 0.5, scaleY: 0.5, opacity: 1
          }, {
            onChange() {
              canvas.renderAll()
            },
            duration: 250
          })
        } else {
          clickSound.play()
          incorrectCount++
        }
        disableShapeEvents(shapes[i], shapeClickHandler)
        renderTooltip(canvas, e.clientY - 64, e.clientX + 16, target.isTriangle, i)

        if (incorrectCount === constants.MAX_INCORRECT_COUNT) onFailure()
        if (correctCount === totalTriangleCount) {
          levelIndicatorGroup.item(currLevel++).set({ fill: 'black' })
          uiTimeoutId = setTimeout(() => {
            onSuccess()
            clearTimeout(uiTimeoutId)
          }, 1000)
        }
      }
      enableShapeEvents(shapes[i], shapeClickHandler)
    }
  }

  renderLevel1(renderLevel2, () => renderModalWithTTS(messages.TITLE_MODAL_INCORRECT))
}