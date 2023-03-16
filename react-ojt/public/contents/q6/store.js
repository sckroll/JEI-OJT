import opt from './options.js'

export let availableNums = new Set()

export const audio = {
  click: new Audio(opt.AUDIO_CLICK),
  correct: new Audio(opt.AUDIO_CORRECT),
  title: new Audio(opt.AUDIO_TITLE)
}