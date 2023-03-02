import Sprite from "./sprite.js"

const SPEED = 2
let first = 3, second = 1, animationId = null, startTime = null

/**
 * 폼 입력
 */

const $form = document.getElementById('form')
$form.addEventListener('click', e => {
  e.preventDefault()
})

const $first = document.getElementById('first')
$first.value = first
$first.addEventListener('keyup', ({ target, key }) => {
  if (Number.isNaN(+key)) return
  target.value = +key === 0 ? 1 : +key
  first = +key
})
$first.addEventListener('change', ({ target }) => {
  first = +target.value
})

const $second = document.getElementById('second')
$second.value = second
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
  coin1.stop(coin1.animationId)
  coin2.stop(coin2.animationId)
  coin3.stop(coin3.animationId)
  coin4.stop(coin4.animationId)
  animationId = requestAnimationFrame(playAnimation)
})

/**
 * 캔버스 & 애니메이션
 */

const $canvas = document.getElementById('canvas')
const ctx = $canvas.getContext('2d')

// const drawDirect = path => {
//   ctx.beginPath()

//   const commands = path.split(' ')
//   for (const cmd of commands) {

//   }

//   ctx.stroke()
//   ctx.closePath()
// }

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

const drawTextArea = (text) => {
  ctx.fillStyle = 'black'
  ctx.font = '48px Arial'
  ctx.fillText(`${first} + ${second} = `, 285, 400)
  ctx.rect(455, 358, 50, 50)

  ctx.strokeStyle = 'lightgrey'
  ctx.fillText(text, 466, 400)
  ctx.stroke()
}

const drawFrame = (time = 0, speed = 1) => {
  const offsetY = 160, circleSize = 10, circleGap = 40
  const offsetX = 360 - (first + second - 2) * circleSize * 2
  const maxDelta = 100

  // 색상을 서서히 변화시키도록 변화 과정 중간의 색을 리턴하는 함수
  // (ctx.fillStyle에 색상 값을 할당하면 자동으로 hex 값으로 변환되는 점을 응용)
  const changeColor = (fromColor, toColor, percentage) => {
    let result = '#'

    ctx.fillStyle = fromColor
    const fromStr = ctx.fillStyle

    ctx.fillStyle = toColor
    const toStr = ctx.fillStyle

    for (let i = 1; i <= 6; i += 2) {
      const fromHex = parseInt(fromStr.substring(i, i + 2), 16)
      const toHex = parseInt(toStr.substring(i, i + 2), 16)

      const colorHex = Math.round(fromHex + (toHex - fromHex) / 100 * percentage)
      result += colorHex < 16 ? '0' + colorHex.toString(16) : colorHex.toString(16)
    }
    return result
  }

  for (let i = 0; i < first; i++) {
    const delta = Math.min(maxDelta, Math.max(0, (time * speed / 1000 - i) * maxDelta))
    drawCircle(offsetX + i * circleGap, offsetY, circleSize, 'crimson')
    drawCircle(offsetX + i * circleGap, offsetY + delta, circleSize + delta / 20, changeColor('crimson', 'green', delta))
  }
  for (let i = 0; i < second; i++) {
    const delta = Math.min(maxDelta, Math.max(0, (time * speed / 1000 - i - first) * maxDelta))
    drawCircle(offsetX + circleGap * (first + 1 + i), offsetY, circleSize, 'slateblue')
    drawCircle(offsetX + circleGap * (first + 1 + i), offsetY + delta, circleSize + delta / 20, changeColor('slateblue', 'green', delta))
  }

  // 현재 시간을 기준으로 1 -> 0 -> 1 -> ... 순으로 소수를 리턴하는 함수
  const betweenZeroAndOne = (ms) => {
    return (~~(time / ms) % 2 === 0 ? ms - (time % ms) : time % ms) / ms
  }

  // const lineColor = `rgba(0, 0, 0, ${0.5 * Math.max(0, 1000 - time) / 1000})` // fade-out
  const lineColor = `rgba(0, 0, 0, ${0.5 * betweenZeroAndOne(500)})` // blink
  const rightOutlineCurve = '27 0 27 40 0 40'
  const leftOutlineCurve = rightOutlineCurve.split(' ').map(n => -n).join(' ')
  const topOutlineCurve = '0 -40 80 -40 80 0'

  ctx.lineWidth = 3
  drawPath(`M ${offsetX} ${offsetY - circleSize * 2} h ${circleGap * (first - 1)} c ${rightOutlineCurve} h -${circleGap * (first - 1)} c ${leftOutlineCurve} Z`, lineColor)
  drawPath(`M ${offsetX + circleGap * (first + 1)} ${offsetY - circleSize * 2} h ${circleGap * (second - 1)} c ${rightOutlineCurve} h -${circleGap * (second - 1)} c ${leftOutlineCurve} Z`, lineColor)
  drawPath(`M ${offsetX + circleGap * (first - 1)} ${offsetY - circleSize * 2} c ${topOutlineCurve}`, lineColor)

  drawTextArea(time === 0 ? '?' : Math.floor(time * speed / 1000))
}

const playAnimation = timestamp => {
  // 캔버스 지우기
  ctx.clearRect(0, 0, $canvas.clientWidth, $canvas.clientHeight)
  
  if (!startTime) startTime = timestamp
  const elapsedTime = timestamp - startTime
  
  drawFrame(elapsedTime, SPEED)

  if (elapsedTime > 1000 / SPEED * (first + second)) {
    cancelAnimationFrame(animationId)
    startTime = null
    return
  }
  animationId = requestAnimationFrame(playAnimation)
}

drawFrame()

/**
 * 스프라이트
 */

const coin1 = new Sprite(ctx, {
  src: 'images/coins.png',
  sx: 140,
  sy: 24,
  sw: 62,
  sh: 61,
  dx: 0,
  dy: 0,
  maxCount: 10,
  fps: 120
})
coin1.start()

const coin2 = new Sprite(ctx, {
  src: 'images/coins.png',
  sx: 123,
  sy: 101,
  sw: 67,
  sh: 67,
  dx: 70,
  dy: 0,
  fps: 60
})
coin2.start()

const coin3 = new Sprite(ctx, {
  src: 'images/coins.png',
  sx: 115,
  sy: 186,
  sw: 70,
  sh: 70,
  dx: 150,
  dy: 0,
})
coin3.start()

const coin4 = new Sprite(ctx, {
  src: 'images/coins.png',
  sx: 93,
  sy: 362,
  sw: 77,
  sh: 77,
  dx: 230,
  dy: 0,
  fps: 15
})
coin4.start()