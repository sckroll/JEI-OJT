import Sprite from "./sprite.js"
import Animation from './animation.js'

const src = 'images/coins.png'
const spriteData = [
  { src, sx: 140, sy: 24, sw: 62, sh: 61, dx: 10, dy: 10, maxCount: 10, fps: 120 },
  { src, sx: 123, sy: 101, sw: 67, sh: 67, dx: 80, dy: 10, fps: 60 },
  { src, sx: 115, sy: 186, sw: 70, sh: 70, dx: 630, dy: 10 },
  { src, sx: 93, sy: 362, sw: 77, sh: 77, dx: 710, dy: 10, fps: 15 }
]

let first = 3, second = 1

/**
 * 캔버스 & 애니메이션
 */

const $canvas = document.getElementById('canvas')
const ctx = $canvas.getContext('2d')

let animation = new Animation(ctx, { first, second })

/**
 * 스프라이트
 */

const coins = []
for (let i = 0; i < spriteData.length; i++) {
  coins[i] = new Sprite(ctx, spriteData[i])
  coins[i].start()
}

/**
 * 폼 입력
 */

const $form = document.getElementById('form')
$form.addEventListener('click', e => e.preventDefault())

const $first = document.getElementById('first')
$first.value = first
$first.addEventListener('keyup', ({ target, key }) => {
  if (Number.isNaN(+key)) return
  target.value = +key === 0 ? 1 : +key
  first = +key
})
$first.addEventListener('change', ({ target }) => first = +target.value)

const $second = document.getElementById('second')
$second.value = second
$second.addEventListener('keyup', ({ target, key }) => {
  if (Number.isNaN(+key)) return
  target.value = +key === 0 ? 1 : +key
  second = +key
})
$second.addEventListener('change', ({ target }) => second = +target.value)

const $actions = document.getElementById('actions')
$actions.addEventListener('click', ({ target }) => {
  if (target.id === 'play') {
    if (!animation.isPaused && !animation.isReady) return

    if (!animation.isPaused) {
      for (let i = 0; i < spriteData.length; i++) {
        coins[i].stop(coins[i].animationId)
      }
    
      const maxTime = (first + second + 1) * 1000
      animation = new Animation(ctx, { maxTime, first, second })
    }
    animation.start()

  } else if (target.id === 'pause') {
    if (animation.isReady || animation.isPaused) return
    animation.pause()
  } else if (target.id === 'stop') {
    if (animation.isReady || animation.isStopped) return
    animation.stop(true)
  }
})