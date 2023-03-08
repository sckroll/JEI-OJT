/**
 * TTS API를 사용하여 텍스트를 음성으로 변환
 */
export const speakText = text => {
  let voice = null
  speechSynthesis.addEventListener('voiceschanged', () => {
    voice = speechSynthesis.getVoices().filter(v => v.lang === 'ko-KR')[0]
  })

  const utterThis = new SpeechSynthesisUtterance(text)
  utterThis.voice = voice
  speechSynthesis.speak(utterThis)
}

/**
 * 각도를 라디안 값으로 변환
 */
export const deg2Rad = deg => {
  return deg * Math.PI / 180
}