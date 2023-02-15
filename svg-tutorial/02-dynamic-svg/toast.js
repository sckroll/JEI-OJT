import opt from './options.js'

let toastTimeoutId = null

/**
 * 토스트 메시지 띄우기
 */
export const showToast = () => {
  document.querySelector('.incorrect-toast').classList.add('visible')
  toastTimeoutId = setTimeout(() => {
    document.querySelector('.incorrect-toast').classList.remove('visible')
    clearTimeout(toastTimeoutId)
  }, opt.TOAST_TIME)
}