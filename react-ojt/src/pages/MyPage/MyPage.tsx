import { createRef, useContext, useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import HeaderMenu from "../../components/HeaderMenu"
import { authCheck, getContentState, resetContentState } from "../../api"
import { ContentState, User } from "../../types"
import Button from "../../components/Button"
import { userPlaceholder } from "../../config"
import ContentContext from "../../context"

export default function MyPage() {
  const [userInfo, setUserInfo] = useState<User | null>(userPlaceholder)
  // const [contentState, setContentState] = useState<ContentState[]>()
  const [strokeDasharray, setStrokeDasharray] = useState(0)
  const navigate = useNavigate()

  const contentState = useContext(ContentContext)

  const successRef = createRef<SVGPathElement>()
  const failureRef = createRef<SVGPathElement>()

  const totalCount = useMemo(() => {
    return contentState ? contentState.length - 1 : 0
  }, [contentState])
  const successCount = useMemo(() => {
    return contentState ? contentState.filter(c => c.id > 0 && c.state === 'success').length  : 0
  }, [contentState])
  const failureCount = useMemo(() => {
    return contentState ? contentState.filter(c => c.id > 0 && c.state === 'failure').length : 0
  }, [contentState])
  const unsolvedCount = useMemo(() => {
    return contentState ? contentState.filter(c => c.id > 0 && c.state === 'unknown').length : 0
  }, [contentState])
  const solvedCount = useMemo(() => totalCount - unsolvedCount, [contentState])
  const successPercentage = useMemo(() => Math.round((successCount / totalCount) * 100 || 0), [contentState])
  const solvedPercentage = useMemo(() => Math.round((solvedCount / totalCount) * 100 || 0), [contentState])
  const successStrokeDashoffset = useMemo(() => strokeDasharray - strokeDasharray * successPercentage / 100, [contentState])
  const failureStrokeDashoffset = useMemo(() => strokeDasharray - strokeDasharray * solvedPercentage / 100, [contentState])

  const onClick = () => {
    if (confirm('기록을 모두 초기화하시겠어요?')) {
      onReset()
      alert('기록이 모두 초기화되었어요.')
    }
  }
  const onReset = async () => {
    try {
      await resetContentState()
    } catch (e) {
      console.error(e)
      alert('서버에 문제가 발생했습니다. 잠시 후에 다시 시도해주세요.')
    }
  }

  useEffect(() => {
    const chackAuthState = async () => {
      const user = await authCheck()
      if (!user) return
      setUserInfo(user)
      
      // const myContentState = await getContentState()
      // setContentState(myContentState)
    }
    chackAuthState()
    
    setStrokeDasharray(successRef.current?.getTotalLength() ?? 0)
    setStrokeDasharray(failureRef.current?.getTotalLength() ?? 0)
  }, [contentState])
  useEffect(() => {
    if (!userInfo) navigate('/sign-in')
  }, [userInfo])

  return (
    <>
      <HeaderMenu />

      <div className="h-full flex flex-col justify-around">
        <div className="text-center">
          <p>{userInfo?.name}님은 총 {totalCount}문제 중 <strong>{solvedCount}문제</strong>를 풀었어요.</p>
          <p>아직 풀지 못한 문제는 <strong>{unsolvedCount}문제</strong>가 있어요.</p>
          <p className="text-xs text-slate-400 mt-1">성취도 = (맞은 문제 수 / 총 문제 수) x 100</p>
        </div>
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
        <div className="grid grid-cols-4">
          <div className="flex flex-col items-center gap-y-1">
            <p className="text-sm">총 문제 수</p>
            <p className="font-bold">{totalCount}개</p>
          </div>
          <div className="flex flex-col items-center gap-y-1 text-teal-600">
            <p className="text-sm">맞은 문제 수</p>
            <p className="font-bold">{successCount}개</p>
          </div>
          <div className="flex flex-col items-center gap-y-1 text-red-700">
            <p className="text-sm">틀린 문제 수</p>
            <p className="font-bold">{failureCount}개</p>
          </div>
          <div className="flex flex-col items-center gap-y-1 text-slate-400">
            <p className="text-sm">못 푼 문제 수</p>
            <p className="font-bold">{unsolvedCount}개</p>
          </div>
        </div>
      </div>

      <div className="m-2">
        <Button onClick={onClick}>
          기록 초기화
        </Button>
      </div>
    </>
  )
}
