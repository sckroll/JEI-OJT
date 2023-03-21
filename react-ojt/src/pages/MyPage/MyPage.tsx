import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { authCheck } from "../../api"
import HeaderMenu from "../../components/HeaderMenu"

export default function MyPage() {
  const [isSignedIn, setIsSignedIn] = useState<string | null>(null)
  const navigate = useNavigate()
  const circleGraphEl = useRef(null)

  useEffect(() => {
    const chackAuthState = async () => {
      const authCheckResult = await authCheck()
      setIsSignedIn(authCheckResult)
    }
    chackAuthState()
    if (!isSignedIn) navigate('/sign-in')
  }, [])

  if (!isSignedIn) return null
  return (
    <>
      <HeaderMenu />

      <div className="h-full flex flex-col">
        <p>
          김성찬님은 6문제 중 <strong>0문제</strong>를 풀었어요.
          <br />
          아직 풀지 못한 문제는 총 6문제가 있어요.
        </p>
        <svg width="100%" viewBox="0 0 120 120">
          <path
            d="M 60, 5 a 50, 50 0 1, 0 0, 110 a 50, 50 0 1, 0 0, -110"
            className="stroke-slate-300 stroke-[4px] fill-transparent"
          />
          <path
            d="M 60, 5 a 50, 50 0 1, 0 0, 110 a 50, 50 0 1, 0 0, -110"
            className="stroke-slate-700 stroke-[8px] fill-transparent"
            ref={circleGraphEl}
          />
        </svg>
      </div>
    </>
  )
}
