const TITLE_MSG = '삼각형을 찾아 고르세요.'
const CLICK_SOUND_SRC = './mp3/MP_Blop.mp3'
const CORRECT_SOUND_SRC = './mp3/MP_스테이지 클리어 (레트로).mp3'
const CANVAS_MARGIN = 200
const LEVELS = 2
const MAX_INCORRECT_COUNT = 3

let currLevel = 0, incorrectCount = 0, timeoutId = null
const clickSound = new Audio(CLICK_SOUND_SRC)
const correctSound = new Audio(CORRECT_SOUND_SRC)
correctSound.volume = 0.4

// TTS 적용을 위한 음성 데이터 필터링
let voice = null
speechSynthesis.addEventListener('voiceschanged', () => {
  voice = speechSynthesis.getVoices().filter(v => v.lang === 'ko-KR')[0]
})

/**
 * 캔버스 요소 생성
 */

const $container = document.getElementById('container')
const $canvas = document.createElement('canvas')
$canvas.id = 'canvas'
$canvas.width = $container.clientWidth
$canvas.height = $container.clientHeight
$container.appendChild($canvas)

/**
 * UI 그리기
 */

const canvas = new fabric.Canvas('canvas', {
  selection: false,
  hoverCursor: 'pointer'
})

const titleIcon = new fabric.Text('🔈', {
  originY: 'center',
  hoverCursor: 'pointer'
})
const titleText = new fabric.Text(TITLE_MSG, {
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

const levelIndicatorGroup = new fabric.Group([], {
  selectable: false,
  hoverCursor: 'default'
})
for (let i = 0; i < LEVELS; i++) {
  levelIndicatorGroup.addWithUpdate(new fabric.Path('M 0 0 l 10 10 l 20 -20 l 5 5 l -25 25 l -15 -15 z', {
    left: 64 * i,
    fill: 'transparent',
    stroke: 'black',
    strokeWidth: 2
  }))
}
levelIndicatorGroup.set({ top: 30, left: canvas.width - levelIndicatorGroup.width - 30 })
canvas.add(levelIndicatorGroup)

titleIcon.on('mousedown', () => {
  const utterThis = new SpeechSynthesisUtterance(TITLE_MSG)
  utterThis.voice = voice
  speechSynthesis.speak(utterThis)
})

/**
 * 삼각형 그리기
 */

const colors = ['red', 'blue', 'green', 'cyan', 'magenta', 'yellow', 'brown', 'purple']
let hasTriangle = false

const deg2Rad = deg => deg * Math.PI / 180

for (let i = 0; i < 8; i++) {
  const randomNumber = (i === 7 && !hasTriangle) ? 0 : ~~(Math.random() * 4)
  let path = null

  if (randomNumber <= 1) {
    // 삼각형 (0) & 패스 (1)
    const x1 = ~~(Math.random() * (canvas.width - CANVAS_MARGIN * 2)) + CANVAS_MARGIN
    const y1 = ~~(Math.random() * (canvas.height - CANVAS_MARGIN * 2)) + CANVAS_MARGIN
    const x2 = (~~(Math.random() * 2) === 0 ? 1 : -1) * (~~(Math.random() * 100) + 50)
    const y2 = (~~(Math.random() * 2) === 0 ? 1 : -1) * (~~(Math.random() * 100) + 50)
    const x3 = Math.cos(Math.atan2(y2, x2) + deg2Rad(~~(Math.random() * 60) + 60)) * (~~(Math.random() * 100) + 50)
    const y3 = Math.sin(Math.atan2(y2, x2) + deg2Rad(~~(Math.random() * 60) + 60)) * (~~(Math.random() * 100) + 50)

    path = new fabric.Path(`M ${x1} ${y1} l ${x2} ${y2} l ${x3} ${y3}${randomNumber === 0 ? ' z' : ''}`, {
      fill: 'transparent',
      stroke: colors[i],
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

    path = new fabric.Path(`M ${x1} ${y1} l ${x2} ${y2} l ${x3} ${y3} l ${x4} ${y4} z`, {
      fill: 'transparent',
      stroke: colors[i],
      strokeWidth: 2,
      selectable: false,
      isTriangle: false
    })
  } else if (randomNumber === 3) {
    // 원 (3)
    const left = ~~(Math.random() * (canvas.width - CANVAS_MARGIN)) + 100
    const top = ~~(Math.random() * (canvas.height - CANVAS_MARGIN)) + 100
    const radius = ~~(Math.random() * 50) + 50

    path = new fabric.Circle({
      left,
      top,
      radius,
      fill: 'transparent',
      stroke: colors[i],
      strokeWidth: 2,
      selectable: false,
      isTriangle: false
    })
  }

  // 도형 일부가 뷰포트 밖으로 나가거나 다른 도형과 충돌할 경우 재배치
  let isCollided = false
  const { left, top, width, height } = path.getBoundingRect()
  if (left < 0 || top < 0 || left + width > canvas.width || top + height > canvas.height) isCollided = true
  canvas.forEachObject(obj => {
    if (path.intersectsWithObject(obj)) isCollided = true
  })
  if (isCollided) {
    i--
    continue
  }

  // 삼각형 존재 여부 갱신
  if (randomNumber === 0) hasTriangle = true

  canvas.add(path)
  path.on('mousedown', ({ target }) => {
    const { left, top, width } = target.getBoundingRect()
    const tooltipBackground = new fabric.Rect({
      width: 48,
      height: 48,
      rx: 8,
      fill: 'green',
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
      top: top - 48,
      left: left + width,
      selectable: false,
      hoverCursor: 'default',
      opacity: 0
    })
    if (target.isTriangle) {
      correctSound.play()
      tooltip.removeWithUpdate(incorrectShape)
      levelIndicatorGroup.item(currLevel++).set({ fill: 'black' })
      incorrectCount = 0
    } else {
      clickSound.play()
      tooltip.removeWithUpdate(correctShape)
      incorrectCount++
    }
    canvas.add(tooltip)

    tooltip.animate('opacity', 1, {
      onChange() {
        canvas.renderAll()
      },
      duration: 150
    })
    timeoutId = setTimeout(() => {
      tooltip.animate('opacity', 0, {
        onChange() {
          canvas.renderAll()
        },
        duration: 150
      })
      clearTimeout(timeoutId)
    }, 500)

    if (incorrectCount === MAX_INCORRECT_COUNT) {
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
      const title = new fabric.Text('조금 아쉬워요!', {
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
      const buttonForeground = new fabric.Text('다시 할래요', {
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
      const modalGroup = new fabric.Group([overlay, modalContainer, title, buttonGroup], {
        top: 0,
        left: 0,
        selectable: false,
        subTargetCheck: true,
        hoverCursor: 'default'
      })
      canvas.add(modalGroup)

      buttonGroup.on('mousedown', () => {
        console.log('asdf');
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
    }
  })
}