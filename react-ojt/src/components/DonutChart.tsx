import { createRef, useEffect, useState } from "react"

type PropTypes = {
  successPercentage: number,
  solvedPercentage: number
}

export default function DonutChart({ successPercentage, solvedPercentage }: PropTypes) {
  const [strokeDasharray, setStrokeDasharray] = useState(0)

  const successRef = createRef<SVGPathElement>()
  const failureRef = createRef<SVGPathElement>()

  const successStrokeDashoffset = strokeDasharray - strokeDasharray * successPercentage / 100
  const failureStrokeDashoffset = strokeDasharray - strokeDasharray * solvedPercentage / 100

  useEffect(() => {
    setStrokeDasharray(successRef.current?.getTotalLength() ?? 0)
    setStrokeDasharray(failureRef.current?.getTotalLength() ?? 0)
  }, [])
  
  return (
    <div className="relative flex justify-center items-center">
      <svg width="80%" viewBox="0 0 120 120" className="absolute">
        <path
          d="M 60, 5 a 50, 50 0 1, 0 0, 110 a 50, 50 0 1, 0 0, -110"
          className="stroke-slate-200 stroke-[8px] fill-transparent"
        />
        <path
          d="M 60, 5 a 50, 50 0 1, 0 0, 110 a 50, 50 0 1, 0 0, -110"
          className="stroke-red-700 stroke-[8px] fill-transparent"
          style={{ strokeLinecap: 'round', strokeDasharray, strokeDashoffset: failureStrokeDashoffset }}
          ref={failureRef}
        />
        <path
          d="M 60, 5 a 50, 50 0 1, 0 0, 110 a 50, 50 0 1, 0 0, -110"
          className="stroke-teal-600 stroke-[8px] fill-transparent"
          style={{ strokeLinecap: 'round', strokeDasharray, strokeDashoffset: successStrokeDashoffset }}
          ref={successRef}
        />
      </svg>
      <div className="absolute text-center">
        <p>성취도</p>
        <p className="text-4xl font-bold">{successPercentage || 0}%</p>
      </div>
    </div>
  )
}
