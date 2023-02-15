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
      action(firstNumCandidate, secondNumCandidate) {
        const $introErrorMessage = document.querySelector('.intro-error-message')

        if (Number.isNaN(firstNumCandidate) || Number.isNaN(secondNumCandidate)) {
          $introErrorMessage.innerText = opt.MSG_ERROR_NAN
          return
        }
        if (firstNumCandidate + secondNumCandidate > 9) {
          $introErrorMessage.innerText = opt.MSG_ERROR_OVER_NINE
          return
        }
        if (firstNumCandidate < 1 || secondNumCandidate < 1) {
          $introErrorMessage.innerText = opt.MSG_ERROR_UNDER_ONE
          return
        }

        hideModal()
        render(firstNumCandidate, secondNumCandidate)
      }
    },
    {
      text: opt.BTN_TEXT_RANDOM_1,
      action() {
        const firstNumCandidate = ~~(Math.random() * 8) + 1
        
        hideModal()
        render(firstNumCandidate, 1)
      }
    },
    {
      text: opt.BTN_TEXT_RANDOM_2,
      action() {
        const firstNumCandidate = ~~(Math.random() * 8) + 1
        const secondNumCandidate = ~~(Math.random() * (9 - firstNumCandidate)) + 1

        hideModal()
        render(firstNumCandidate, secondNumCandidate)
      }
    }
  ]
})