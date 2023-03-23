import { useContext, useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { authCheck } from "../api"
import { userPlaceholder } from "../config"
import ContentContext from "../context"
import { User } from "../types"
import DonutChart from "./DonutChart"

export default function ContentStats() {
  const [userInfo, setUserInfo] = useState<User | null>(userPlaceholder)
  const navigate = useNavigate()

  const contentState = useContext(ContentContext)

  const totalCount = useMemo(() => {
    return contentState && contentState.length > 0 ? contentState.length - 1 : 0
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

  useEffect(() => {
    const chackAuthState = async () => {
      const user = await authCheck()
      if (!user) return
      setUserInfo(user)
    }
    chackAuthState()
  }, [contentState])
  useEffect(() => {
    if (!userInfo) navigate('/sign-in')
  }, [userInfo])

  return (
    <div className="h-full flex flex-col justify-around">
      <div className="text-center">
        <p>{userInfo?.name}님은 총 {totalCount}문제 중 <strong>{solvedCount}문제</strong>를 풀었어요.</p>
        <p>아직 풀지 못한 문제는 <strong>{unsolvedCount}문제</strong>가 있어요.</p>
        <p className="text-xs text-slate-400 mt-1">성취도 = (맞은 문제 수 / 총 문제 수) x 100</p>
      </div>

      <DonutChart successPercentage={successPercentage} solvedPercentage={solvedPercentage} />

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
  )
}
