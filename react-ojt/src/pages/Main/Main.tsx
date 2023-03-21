import { ReactNode, useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import Button from '../../components/Button'
import HeaderMenu from '../../components/HeaderMenu'
import { paths } from '../../config'
import { authCheck } from '../../api'

type PropTypes = {
  children: ReactNode
}

const ButtonWrapper = ({ children }: PropTypes) => {
  return (
    <div className="flex flex-col gap-y-3 mb-4">
      { children }
    </div>
  )
}

export default function Main() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [contentIdx, setContentIdx] = useState(() => {
    const currPathIdx = paths.findIndex(({ path }) => path === pathname.split('/')[2])
    return currPathIdx === -1 ? 0 : currPathIdx
  })
  const [isSignedIn, setIsSignedIn] = useState(true)

  const onClick = (idx: number) => {
    setContentIdx(idx)
    navigate(`/main/${idx >= paths.length ? 'clear' : paths[idx].path}`)
  }

  useEffect(() => {
    const chackAuthState = async () => {
      const authCheckResult = await authCheck()
      setIsSignedIn(authCheckResult)
    }
    chackAuthState()
    
    navigate(`/main/${contentIdx >= paths.length ? 'clear' : paths[contentIdx].path}`)
  }, [contentIdx])
  useEffect(() => {
    if (!isSignedIn) navigate('/sign-in')
  }, [isSignedIn])

  return (
    <>
      <HeaderMenu />
      <Outlet context={{ idx: contentIdx }} />
      <ButtonWrapper>
        { paths.map(({ path, name }, idx) => (
          <Button key={path} onClick={() => onClick(idx)}>{ name }</Button>
        )) }
      </ButtonWrapper>
    </>
  )
}
