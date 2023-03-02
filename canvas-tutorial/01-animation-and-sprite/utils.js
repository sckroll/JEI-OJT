/**
 * 색상을 서서히 변화시키도록 변화 과정 중간의 색을 리턴하는 함수
 * (ctx.fillStyle에 색상 값을 할당하면 자동으로 hex 값으로 변환되는 점을 응용)
 */
export const changeColor = (ctx, fromColor, toColor, percentage) => {
  let result = '#'

  ctx.fillStyle = fromColor
  const fromStr = ctx.fillStyle

  ctx.fillStyle = toColor
  const toStr = ctx.fillStyle

  for (let i = 1; i <= 6; i += 2) {
    const fromHex = parseInt(fromStr.substring(i, i + 2), 16)
    const toHex = parseInt(toStr.substring(i, i + 2), 16)

    const colorHex = Math.round(fromHex + (toHex - fromHex) / 100 * percentage)
    result += colorHex < 16 ? '0' + colorHex.toString(16) : colorHex.toString(16)
  }
  return result
}

/**
 * 현재 시간을 기준으로 1 -> 0 -> 1 -> ... 순으로 소수를 리턴하는 함수
 */
export const betweenZeroAndOne = (currTime, duration) => {
  if (~~(currTime / duration) % 2 === 0) return (duration - (currTime % duration)) / duration
  else return (currTime % duration) / duration
}