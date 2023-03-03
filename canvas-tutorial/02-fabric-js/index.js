/**
 * 캔버스 요소 생성
 */
const $container = document.getElementById('container')
const $canvas = document.createElement('canvas')
$canvas.id = 'canvas'
$canvas.width = $container.clientWidth
$canvas.height = $container.clientHeight
$container.appendChild($canvas)

const canvas = new fabric.Canvas('canvas')

const rect = new fabric.Rect({
  left: 200,
  top: 200,
  // fill: 'red',
  width: 100, 
  height: 100
})
rect.set('fill', new fabric.Gradient({
  type: 'linear',
  gradientUnits: 'pixels',
  coords: { x1: 0, y1: 0, x2: 0, y2: rect.height },
  colorStops: [
    { offset: 0, color: 'black' },
    { offset: 1, color: 'white' }
  ]
}))

canvas.add(rect)
rect.animate('angle', 720, {
  onChange() {
    canvas.renderAll()
  },
  duration: 3000,
  easing: fabric.util.ease.easeOutBounce
})