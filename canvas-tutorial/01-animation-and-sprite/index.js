let first = 1, second = 1

/**
 * 폼 입력
 */

const $form = document.getElementById('form')
$form.addEventListener('click', e => {
  e.preventDefault()
})

const $first = document.getElementById('first')
$first.addEventListener('keyup', ({ target, key }) => {
  if (Number.isNaN(+key)) return
  target.value = +key === 0 ? 1 : +key
  first = +key
})
$first.addEventListener('change', ({ target }) => {
  first = +target.value
})

const $second = document.getElementById('second')
$second.addEventListener('keyup', ({ target, key }) => {
  if (Number.isNaN(+key)) return
  target.value = +key === 0 ? 1 : +key
  second = +key
})
$second.addEventListener('change', ({ target }) => {
  second = +target.value
})

const $submit = document.getElementById('submit')
$submit.addEventListener('click', () => {
  console.log(`${first} + ${second}`);
  draw()
})

const $canvas = document.getElementById('canvas')
const ctx = $canvas.getContext('2d')

const drawDirect = path => {
  ctx.beginPath()

  const commands = path.split(' ')
  for (const cmd of commands) {

  }

  ctx.stroke()
  ctx.closePath()
}

const drawWithDraw2D = path => {
  const newPath = new Path2D(path)
  ctx.stroke(newPath)
}

const drawCircle = (x, y, r, fillColor = 'black') => {
  ctx.beginPath()
  ctx.fillStyle = fillColor
  ctx.arc(x, y, r, 0, 360);
  ctx.fill()
}

const drawPath = (path, strokeColor = 'black', fillColor = 'transparent') => {
  ctx.beginPath()
  ctx.strokeStyle = strokeColor
  ctx.fillStyle = fillColor
  
  const newPath = new Path2D(path)
  ctx.stroke(newPath)
  ctx.fill(newPath)
}

const draw = () => {
  // 캔버스 지우기
  ctx.clearRect(0, 0, $canvas.clientWidth, $canvas.clientHeight)

  let offsetX = 360 - (first + second - 2) * 20

  for (let i = 0; i < first; i++) {
    drawCircle(offsetX + i * 40, 160, 10, 'crimson')
  }
  for (let i = 0; i < second; i++) {
    drawCircle(offsetX + 80 + 40 * (first - 1) + i * 40, 160, 10, 'slateblue')
  }

  ctx.lineWidth = 3
  drawPath(`M ${offsetX} 140 h ${40 * (first - 1)} c 30 0 30 40 0 40 h -${40 * (first - 1)} c -30 0 -30 -40 0 -40 Z`, 'lightgrey')
  drawPath(`M ${offsetX + 80 + 40 * (first - 1)} 140 h ${40 * (second - 1)} c 30 0 30 40 0 40 h -${40 * (second - 1)} c -30 0 -30 -40 0 -40 Z`, 'lightgrey')
  drawPath(`M ${offsetX + 40 * (first - 1)} 140 c 0 -40 80 -40 80 0`, 'lightgrey')
  
  ctx.fillStyle = 'black'
  ctx.font = '48px Arial'
  ctx.fillText(`${first} + ${second} = `, 285, 400)
  ctx.rect(455, 358, 50, 50)
  ctx.stroke()
}

draw()