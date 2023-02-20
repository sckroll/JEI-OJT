// 출처: https://gist.github.com/mbostock/8027637
const getClosestPoint = (pathNode, point) => {
  const distance2 = p => {
    const dx = p.x - point[0], dy = p.y - point[1];
    return dx * dx + dy * dy;
  }

  const pathLength = pathNode.getTotalLength()
  let precision = 8, best, bestLength, bestDistance = Infinity

  // linear scan for coarse approximation
  for (let scan, scanLength = 0, scanDistance; scanLength <= pathLength; scanLength += precision) {
    if ((scanDistance = distance2(scan = pathNode.getPointAtLength(scanLength))) < bestDistance) {
      best = scan, bestLength = scanLength, bestDistance = scanDistance
    }
  }

  // binary search for precise estimate
  precision /= 2;
  while (precision > 0.5) {
    let before, after, beforeLength, afterLength, beforeDistance, afterDistance
    if ((beforeLength = bestLength - precision) >= 0 && (beforeDistance = distance2(before = pathNode.getPointAtLength(beforeLength))) < bestDistance) {
      best = before, bestLength = beforeLength, bestDistance = beforeDistance;
    } else if ((afterLength = bestLength + precision) <= pathLength && (afterDistance = distance2(after = pathNode.getPointAtLength(afterLength))) < bestDistance) {
      best = after, bestLength = afterLength, bestDistance = afterDistance;
    } else {
      precision /= 2;
    }
  }

  return {
    x: best.x,
    y: best.y,
    distance: Math.sqrt(bestDistance),
    bestLength
  }
}

export default getClosestPoint