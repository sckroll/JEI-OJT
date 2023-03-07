const TITLE_MSG = '삼각형을 찾아 고르세요.'
const canvasMargin = 200

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
  selection: false
})

const titleIcon = new fabric.Text('🔈', {
  originY: 'center'
})
const titleText = new fabric.Text(TITLE_MSG, {
  left: 50,
  fontSize: 24,
  originY: 'center'
})
const title = new fabric.Group([titleIcon, titleText], {
  top: 20,
  left: 20,
  selectable: false,
  subTargetCheck: true
})
canvas.add(title)

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

// 
const deg2Rad = deg => deg * Math.PI / 180

for (let i = 0; i < 8; i++) {
  const randomNumber = (i === 7 && !hasTriangle) ? 0 : ~~(Math.random() * 4)
  let path = null

  if (randomNumber <= 1) {
    // 삼각형 (0) & 패스 (1)
    const x1 = ~~(Math.random() * (canvas.width - canvasMargin * 2)) + canvasMargin
    const y1 = ~~(Math.random() * (canvas.height - canvasMargin * 2)) + canvasMargin
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
    const x1 = ~~(Math.random() * (canvas.width - canvasMargin * 2)) + canvasMargin
    const y1 = ~~(Math.random() * (canvas.height - canvasMargin * 2)) + canvasMargin
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
    const left = ~~(Math.random() * (canvas.width - canvasMargin)) + 100
    const top = ~~(Math.random() * (canvas.height - canvasMargin)) + 100
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
    console.log(target.isTriangle);
  })
}