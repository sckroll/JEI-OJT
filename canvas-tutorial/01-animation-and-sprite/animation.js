import { changeColor, betweenZeroAndOne } from './utils.js'

/**
 * 애니메이션을 관리하는 생성자 함수
 */
export default function Animation(ctx, { maxTime = 1000, fps = 60, first, second }) {
  /**
   * 그래픽과 멤버 변수를 초기화하는 메소드
   */
  const init = () => {
    this.isReady = true
    this.isPaused = false
    this.isStopped = false
    this.elapsedTime = 0
    this.elapsedFrameTime = 0
    this.pausedTime = 0
    this.startTime = 0
    this.startFrameTime = 0

    ctx.clearRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight)
    drawFrame()
  }
  
  /**
   * 애니메이션을 재생하는 메소드
   */
  this.start = () => {
    this.isReady = false
    this.isPaused = false
    this.isStopped = false
    this.animationId = requestAnimationFrame(this.update)
  }

  /**
   * 원을 렌더링하는 메소드
   */
  const drawCircle = (x, y, r, fillColor = 'black') => {
    ctx.beginPath()
    ctx.fillStyle = fillColor
    ctx.arc(x, y, r, 0, 360);
    ctx.fill()
  }

  /**
   * 경로를 렌더링하는 메소드
   */
  const drawPath = (path, strokeColor = 'black', fillColor = 'transparent') => {
    ctx.beginPath()
    ctx.strokeStyle = strokeColor
    ctx.fillStyle = fillColor
    ctx.lineWidth = 3

    const newPath = new Path2D(path)
    ctx.stroke(newPath)
    ctx.fill(newPath)
  }

  /**
   * 텍스트 영역을 렌더링하는 메소드
   */
  const drawTextArea = (text, boxStrokeColor = 'lightgrey') => {
    ctx.fillStyle = 'black'
    ctx.font = '48px Arial'
    ctx.fillText(`${first} + ${second} = `, 285, 400)
    ctx.rect(455, 358, 50, 50)

    ctx.strokeStyle = boxStrokeColor
    ctx.fillText(text, 466, 400)
    ctx.stroke()
  }

  /**
   * 현재 프레임의 화면을 그리는 메소드
   */
  const drawFrame = (time = 0, speed = 1) => {
    const offsetY = 160, circleSize = 10, circleGap = 40, distance = 100
    const offsetX = 360 - (first + second - 2) * circleSize * 2

    for (let i = 0; i < first; i++) {
      const delta = Math.min(distance, Math.max(0, (time * speed / 1000 - i) * distance))
      drawCircle(offsetX + i * circleGap, offsetY, circleSize, 'crimson')
      drawCircle(offsetX + i * circleGap, offsetY + delta, circleSize + delta / 20, changeColor(ctx, 'crimson', 'green', delta))
    }
    for (let i = 0; i < second; i++) {
      const delta = Math.min(distance, Math.max(0, (time * speed / 1000 - i - first) * distance))
      drawCircle(offsetX + circleGap * (first + 1 + i), offsetY, circleSize, 'slateblue')
      drawCircle(offsetX + circleGap * (first + 1 + i), offsetY + delta, circleSize + delta / 20, changeColor(ctx, 'slateblue', 'green', delta))
    }

    let lineColor = `rgba(0, 0, 0, ${0.5 * betweenZeroAndOne(time, 500)})` // blink
    const rightOutlineCurve = '27 0 27 40 0 40'
    const leftOutlineCurve = rightOutlineCurve.split(' ').map(n => -n).join(' ')
    const topOutlineCurve = '0 -40 80 -40 80 0'

    drawPath(`M ${offsetX} ${offsetY - circleSize * 2} h ${circleGap * (first - 1)} c ${rightOutlineCurve} h -${circleGap * (first - 1)} c ${leftOutlineCurve} Z`, lineColor)
    drawPath(`M ${offsetX + circleGap * (first + 1)} ${offsetY - circleSize * 2} h ${circleGap * (second - 1)} c ${rightOutlineCurve} h -${circleGap * (second - 1)} c ${leftOutlineCurve} Z`, lineColor)
    drawPath(`M ${offsetX + circleGap * (first - 1)} ${offsetY - circleSize * 2} c ${topOutlineCurve}`, lineColor)

    if (time >= (first + second) * 1000) {
      const fadeOutTime = 500
      lineColor = `rgba(0, 0, 0, ${0.5 * Math.max(0, fadeOutTime - (time - (first + second) * 1000)) / fadeOutTime})` // fade-out
    } else {
      lineColor = 'lightgrey'
    }
    drawTextArea(time === 0 ? '?' : Math.min(~~(time * speed / 1000), first + second), lineColor)

  }

  /**
   * 초당 fps 만큼의 프레임을 렌더링하는 메소드
   */
  this.update = timestamp => {
    if (!this.startTime) this.startTime = timestamp
    if (!this.startFrameTime) this.startFrameTime = timestamp

    this.elapsedTime = timestamp - this.startTime + this.pausedTime
    this.elapsedFrameTime = timestamp - this.startFrameTime

    if (this.elapsedFrameTime >= 1000 / fps) {
      ctx.clearRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight)
      drawFrame(this.elapsedTime)

      if (this.elapsedTime > maxTime) {
        this.startTime = null
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
  this.stop = (lastScene = false) => {
    if (lastScene) {
      ctx.clearRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight)
      drawFrame(maxTime)
    }

    this.isReady = true
    this.isPaused = false
    this.isStopped = true
    this.pausedTime = 0
    cancelAnimationFrame(this.animationId)
  }

  /**
   * 애니메이션을 일시정지하는 메소드
   */
  this.pause = () => {
    this.isPaused = true
    this.pausedTime = this.elapsedTime
    this.startTime = 0
    cancelAnimationFrame(this.animationId)
  }

  init()
}