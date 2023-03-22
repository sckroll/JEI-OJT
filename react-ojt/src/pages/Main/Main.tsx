import { ReactNode, useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import Button from '../../components/Button'
import HeaderMenu from '../../components/HeaderMenu'
import { initialContents, userPlaceholder } from '../../config'
import { authCheck, getContentState } from '../../api'
import { ContentState, User } from '../../types'

type PropTypes = {
  children: ReactNode
}

const ButtonWrapper = ({ children }: PropTypes) => {
  return (
    <div className="grid grid-cols-2 gap-3 mb-4">
      { children }
    </div>
  )
}

export default function Main() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [contentIdx, setContentIdx] = useState(() => {
    const currPathIdx = initialContents.findIndex(({ path }) => path === pathname.split('/')[2])
    return currPathIdx === -1 ? 0 : currPathIdx
  })
  const [userInfo, setUserInfo] = useState<User | null>(userPlaceholder)
  const [contentState, setContentState] = useState<ContentState[]>()

  const onClick = (idx: number) => {
    setContentIdx(idx)
    navigate(`/main/${idx >= initialContents.length ? 'clear' : initialContents[idx].path}`)
  }

  useEffect(() => {
    const chackAuthState = async () => {
      const user = await authCheck()
      setUserInfo(user)
      if (!user) return

      const myContentState = await getContentState()
      setContentState(myContentState)
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
      <ButtonWrapper>
        { contentState && contentState.map(({ id, name, state }, idx) => (
          <Button
            key={id}
            isCurrent={id === contentIdx}
            isSuccess={state === 'success'}
            isFailure={state === 'failure'}
            fullWidth={id === 0}
            onClick={() => onClick(idx)}>
              { name }
          </Button>
        )) }
      </ButtonWrapper>
    </>
  )
}
