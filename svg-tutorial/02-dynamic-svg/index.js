import opt from './options.js'
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

        hideModal()
        render(firstNum, secondNum)
      }
    },
    {
      text: opt.BTN_TEXT_RANDOM_1,
      action() {
        const firstNum = ~~(Math.random() * 8) + 1
        
        hideModal()
        render(firstNum, 1)
      }
    },
    {
      text: opt.BTN_TEXT_RANDOM_2,
      action() {
        const firstNum = ~~(Math.random() * 8) + 1
        const secondNum = ~~(Math.random() * (9 - firstNum)) + 1

        hideModal()
        render(firstNum, secondNum)
      }
    }
  ]
})