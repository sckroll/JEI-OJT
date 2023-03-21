import { ReactNode, useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import Button from '../../components/Button'
import HeaderMenu from '../../components/HeaderMenu'
import { initialContents } from '../../config'
import { authCheck, getContentState } from '../../api'
import { ContentState } from '../../types'

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
    const currPathIdx = initialContents.findIndex(({ path }) => path === pathname.split('/')[2])
    return currPathIdx === -1 ? 0 : currPathIdx
  })
  const [isSignedIn, setIsSignedIn] = useState<string | null>('id')
  const [contentState, setContentState] = useState<ContentState[]>()

  const onClick = (idx: number) => {
    setContentIdx(idx)
    navigate(`/main/${idx >= initialContents.length ? 'clear' : initialContents[idx].path}`)
  }

  useEffect(() => {
    const chackAuthState = async () => {
      const id = await authCheck()
      setIsSignedIn(id)
      if (!id) return

      const myContentState = await getContentState(id)
      setContentState(myContentState)
    }
    chackAuthState()
    
    navigate(`/main/${contentIdx >= initialContents.length ? 'clear' : initialContents[contentIdx].path}`)
  }, [contentIdx])
  useEffect(() => {
    if (!isSignedIn) navigate('/sign-in')
  }, [isSignedIn])

  return (
    <>
      <HeaderMenu />
      <Outlet context={{ idx: contentIdx }} />
      <ButtonWrapper>
        { contentState && contentState.map(({ id, name }, idx) => (
          <Button key={id} isCurrent={id === contentIdx} onClick={() => onClick(idx)}>{ name }</Button>
        )) }
      </ButtonWrapper>
    </>
  )
}
