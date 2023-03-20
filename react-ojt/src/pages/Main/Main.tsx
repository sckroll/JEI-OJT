import { ReactNode, useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import Button from '../../components/Button'
import HeaderMenu from '../../components/HeaderMenu'
import { isSignedIn } from '../../api/auth'
import { paths } from '../../config'

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
    return paths.findIndex(({ path }) => path === pathname.split('/')[2])
  })

  const onClick = (idx: number) => {
    setContentIdx(idx)
    navigate(`/main/${idx >= paths.length ? 'clear' : paths[idx].path}`)
  }

  useEffect(() => {
    if (!isSignedIn()) navigate('/sign-in')
  }, [])
  useEffect(() => {
    navigate(`/main/${contentIdx >= paths.length ? 'clear' : paths[contentIdx].path}`)
  }, [contentIdx])

  if (isSignedIn()) {
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
  return null
}
