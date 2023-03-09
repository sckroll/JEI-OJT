import { initCanvas } from './canvas.js'

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

initContainer()
initCanvas()