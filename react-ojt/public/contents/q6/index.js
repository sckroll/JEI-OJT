import { render } from './svg.js'

const first = ~~(Math.random() * 8) + 1
const second = ~~(Math.random() * (9 - first)) + 1
render(first, second)