import { useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import HeaderMenu from '../../components/HeaderMenu'
import { initialContents, userPlaceholder } from '../../config'
import { authCheck } from '../../api'
import { User } from '../../types'
import FooterButtons from '../../components/FooterButtons'

export default function Main() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [contentIdx, setContentIdx] = useState(() => {
    const currPathIdx = initialContents.findIndex(({ path }) => path === pathname.split('/')[2])
    return currPathIdx === -1 ? 0 : currPathIdx
  })
  const [userInfo, setUserInfo] = useState<User | null>(userPlaceholder)

  const onClick = (idx: number) => {
    setContentIdx(idx)
    navigate(`/main/${idx >= initialContents.length ? 'clear' : initialContents[idx].path}`)
  }

  useEffect(() => {
    const chackAuthState = async () => {
      const user = await authCheck()
      setUserInfo(user)
      if (!user) return
    }
    chackAuthState()
    
    navigate(`/main/${contentIdx >= initialContents.length ? 'clear' : initialContents[contentIdx].path}`)
  }, [contentIdx])
  useEffect(() => {
    if (!userInfo) navigate('/sign-in')
  }, [userInfo])
  
  return (
    <>
      <HeaderMenu />
      <Outlet context={{ idx: contentIdx }} />
      <FooterButtons contentIdx={contentIdx} onClick={onClick} />
    </>
  )
}
