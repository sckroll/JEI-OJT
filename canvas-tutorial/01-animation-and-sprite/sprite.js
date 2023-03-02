/**
 * 스프라이트를 관리하는 생성자 함수
 */
export default function Sprite(ctx, {
  src, sx = 0, sy = 0, sw = 0, sh = 0, dx = 0, dy = 0, dw, dh, maxCount = -1, fps = 30
}) {
  let nextSx = sx, count = 0, startTime = null
  
  const init = () => {
    if (!dw) dw = sw
    if (!dh) dh = sh

    this.image = new Image()
    
    this.image.src = src
    this.image.addEventListener('load', () => {
      ctx.drawImage(this.image, nextSx, sy, sw, sh, dx, dy, dw, dh)
    })

    this.animationId = requestAnimationFrame(update)
  }

  const update = timestamp => {
    if (!startTime) startTime = timestamp
    if (timestamp - startTime >= 1000 / fps) {
      if (nextSx > dw * 6) {
        nextSx = sx
        count++
      } else {
        nextSx += dw
      }
      
      ctx.clearRect(dx, dy, dw, dh)
      ctx.drawImage(this.image, nextSx, sy, sw, sh, dx, dy, dw, dh)
  
      if (count === maxCount) {;
        stop()
        return
      }
      startTime = null
    }

    this.animationId = requestAnimationFrame(update)
  }

  const stop = () => {
    cancelAnimationFrame(this.animationId)
  }

  init()
}