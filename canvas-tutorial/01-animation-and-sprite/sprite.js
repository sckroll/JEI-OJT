/**
 * 스프라이트를 관리하는 생성자 함수
 */
export default function Sprite(ctx, {
  src, sx = 0, sy = 0, sw = 0, sh = 0, dx = 0, dy = 0, dw, dh, maxCount = -1, fps = 30
}) {
  let nextSx = sx, count = 0
  
  /**
   * 스프라이트 그래픽을 렌더링하는 메소드
   */
  const init = () => {
    if (!dw) dw = sw
    if (!dh) dh = sh

    this.image = new Image()
    this.image.src = src
    this.image.addEventListener('load', () => {
      ctx.drawImage(this.image, nextSx, sy, sw, sh, dx, dy, dw, dh)
    })
  }
  
  /**
   * 스프라이트 애니메이션을 재생하는 메소드
   */
  this.start = () => {
    this.animationId = requestAnimationFrame(this.update)
  }

  /**
   * 1초당 fps 만큼 프레임을 렌더링하는 메소드
   */
  this.update = timestamp => {
    if (!this.startFrameTime) this.startFrameTime = timestamp
    if (timestamp - this.startFrameTime >= 1000 / fps) {
      if (nextSx > dw * 6) {
        nextSx = sx
        count++
      } else {
        nextSx += dw
      }
      
      ctx.clearRect(dx, dy, dw, dh)
      ctx.drawImage(this.image, nextSx, sy, sw, sh, dx, dy, dw, dh)
  
      if (count === maxCount) {;
        this.stop()
        return
      }
      this.startFrameTime = null
    }

    this.animationId = requestAnimationFrame(this.update)
  }

  /**
   * 애니메이션을 정지하는 메소드
   */
  this.stop = () => {
    cancelAnimationFrame(this.animationId)
  }

  init()
}