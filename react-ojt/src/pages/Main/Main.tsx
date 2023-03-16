import { ReactNode, useEffect, useState } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import Button from '../../components/Button'
import Content from './Content'
import { isSignedIn } from '../../api/auth'
import Clear from './Clear'
import HeaderMenu from '../../components/HeaderMenu'

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
  const paths = [
    { path: 'tutorial', name: '튜토리얼' },
    { path: 'q1', name: '문제 1' },
    { path: 'q2', name: '문제 2' },
    { path: 'q3', name: '문제 3' },
    { path: 'q4', name: '문제 4' },
    { path: 'q5', name: '문제 5' },
    { path: 'q6', name: '문제 6' }
  ]

  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [contentIndex, setContentIndex] = useState(() => {
    const currPath = pathname.split('/')[2]
    return paths.findIndex(({ path }) => currPath === path)
  })

  const onResult = (isSuccess: boolean) => {
    console.log(isSuccess)

    setContentIndex(n => n + 1)
  }
  const onClick = (idx: number) => {
    setContentIndex(idx)
  }

  useEffect(() => {
    if (!isSignedIn()) navigate('/sign-in')

    if (contentIndex === paths.length) {
      navigate('/main/clear')
    } else if (contentIndex >= 0) {
      navigate(`/main/${paths[contentIndex].path}`)
    }
  }, [contentIndex])

  return (
    isSignedIn() ? (
      <>
        <HeaderMenu />

        <Routes>
          <Route path='*' element={<Navigate to='tutorial' />}></Route>
          <Route path='clear' element={<Clear />}></Route>
          { paths.map(({ path }) => (<Route key={path} path={path} element={<Content onResult={onResult} />}></Route>)) }
        </Routes>

        <ButtonWrapper>
          { paths.map(({ path, name }, idx) => (<Button key={path} onClick={() => onClick(idx)}>{ name }</Button>)) }
        </ButtonWrapper>
      </>
    ) : null
  )
}
