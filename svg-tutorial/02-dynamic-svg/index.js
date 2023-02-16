import opt from './options.js'
import { availableNums, audio } from './store.js'
import { showModal, hideModal } from './modal.js'
import { render } from './svg.js'

showModal({
  title: opt.TITLE_INTRO,
  content: opt.CONTENT_INTRO,
  isIntro: true,
  buttons: [
    {
      text: opt.BTN_TEXT_CUSTOM,
      action(firstNum, secondNum) {
        audio.click.play()

        const $introErrorMessage = document.querySelector('.intro-error-message')

        if (Number.isNaN(firstNum) || Number.isNaN(secondNum)) {
          $introErrorMessage.innerText = opt.MSG_ERROR_NAN
          return
        }
        if (firstNum + secondNum > 9) {
          $introErrorMessage.innerText = opt.MSG_ERROR_OVER_NINE
          return
        }
        if (firstNum < 1 || secondNum < 1) {
          $introErrorMessage.innerText = opt.MSG_ERROR_UNDER_ONE
          return
        }

        for (let i1 = 1; i1 <= 8; i1++) {
          for (let i2 = 1; i1 + i2 <= 9; i2++) {
            availableNums.add(`${i1}${i2}`)
          }
        }
        availableNums.delete(`${firstNum}${secondNum}`)

        hideModal()
        render(firstNum, secondNum)
      }
    },
    {
      text: opt.BTN_TEXT_RANDOM_1,
      action() {
        audio.click.play()
        
        for (let i = 1; i <= 8; i++) {
          availableNums.add(`${i}1`)
        }
        const selected = Array.from(availableNums)[~~(Math.random() * availableNums.size)]
        availableNums.delete(selected)

        hideModal()
        render(...[...selected].map(n => +n))
      }
    },
    {
      text: opt.BTN_TEXT_RANDOM_N,
      action() {
        audio.click.play()

        for (let i1 = 1; i1 <= 8; i1++) {
          for (let i2 = 1; i1 + i2 <= 9; i2++) {
            availableNums.add(`${i1}${i2}`)
          }
        }
        const selected = Array.from(availableNums)[~~(Math.random() * availableNums.size)]
        availableNums.delete(selected)

        hideModal()
        render(...[...selected].map(n => +n))
      }
    }
  ]
})