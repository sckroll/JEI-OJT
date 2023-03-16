let fadeTimeoutId = null, introErrorMessage = ''

/**
 * 모달 표시
 */
export const showModal = ({ title, isIntro, content, buttons }) => {
  let firstNumCandidate = 1, secondNumCandidate = 1

  const $modalOverlay = document.createElement('div')
  $modalOverlay.className = 'modal-overlay'
  document.getElementById('container').appendChild($modalOverlay)

  const $modalContiainer = document.createElement('section')
  $modalContiainer.classList = 'modal-container'
  $modalOverlay.appendChild($modalContiainer)

  const $modalTitle = document.createElement('h1')
  $modalTitle.innerText = title
  $modalContiainer.appendChild($modalTitle)

  const $modalContent = document.createElement('p')
  $modalContent.innerText = content
  $modalContiainer.appendChild($modalContent)

  if (isIntro) {
    const $numInputContainer = document.createElement('div')
    $numInputContainer.classList = 'num-input-container'
    $modalContiainer.appendChild($numInputContainer)

    const $firstNumInput = document.createElement('input')
    $firstNumInput.classList = 'num-input'
    $firstNumInput.type = 'number'
    $firstNumInput.min = '1'
    $firstNumInput.max = '8'
    $firstNumInput.value = '1'
    $numInputContainer.appendChild($firstNumInput)
    $firstNumInput.addEventListener('keyup', e => {
      if (e.target.value.length > 1) e.target.value = e.key
      firstNumCandidate = +e.key
    })
    $firstNumInput.addEventListener('change', e => {
      firstNumCandidate = +e.target.value
    })

    const $plusOp = document.createTextNode('+')
    $numInputContainer.appendChild($plusOp)

    const $secondNumInput = document.createElement('input')
    $secondNumInput.classList = 'num-input'
    $secondNumInput.type = 'number'
    $secondNumInput.min = '1'
    $secondNumInput.max = '8'
    $secondNumInput.value = '1'
    $numInputContainer.appendChild($secondNumInput)
    $secondNumInput.addEventListener('keyup', e => {
      if (e.target.value.length > 1) e.target.value = e.key
      secondNumCandidate = +e.key
    })
    $secondNumInput.addEventListener('change', e => {
      secondNumCandidate = +e.target.value
    })

    const $introErrorMessage = document.createElement('p')
    $introErrorMessage.classList = 'intro-error-message'
    $introErrorMessage.innerText = introErrorMessage
    $modalContiainer.appendChild($introErrorMessage)
  }

  const $modalButtonContainer = document.createElement('div')
  $modalButtonContainer.classList = 'modal-button-container'
  $modalContiainer.appendChild($modalButtonContainer)

  for (const { text, action } of buttons) {
    const $modalButton = document.createElement('button')
    $modalButton.innerText = text
    $modalButtonContainer.appendChild($modalButton)
    $modalButton.addEventListener('click', () => {
      action(firstNumCandidate, secondNumCandidate)
    })
  }

  fadeTimeoutId = setTimeout(() => {
    $modalOverlay.classList.add('visible')
    clearTimeout(fadeTimeoutId)
  }, 10)
}

/**
 * 모달 숨기기
 */
export const hideModal = () => {
  const $modalOverlay = document.querySelector('.modal-overlay')
  $modalOverlay.classList.remove('visible')
  fadeTimeoutId = setTimeout(() => {
    $modalOverlay.remove()
    clearTimeout(fadeTimeoutId)
  }, 250)
}