import { useEffect, useState } from 'react'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { ChartBarIcon, ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline'
import Button from '../../components/Button'
import User from '../../types/User'
import Content from './Content'
import { isSignedIn, signOut } from '../../api/auth'

const HeaderMenu = () => {
  const navigate = useNavigate()

  const myPageRouteHandler = () => {
    navigate('/my-page')
  }
  const logoutHandler = () => {
    if (confirm('로그아웃 하시겠어요?')) {;
      signOut()
      navigate('/sign-in')
    }
  }

  return (
    <div className='flex justify-between items-center'>
    <p>
      <strong className='font-bold'>김성찬</strong>
      님, 안녕하세요!
    </p>
    <div className='flex gap-x-2'>
      <ChartBarIcon
        className='w-8 cursor-pointer stroke-slate-600 hover:stroke-slate-300 transition-colors'
        onClick={myPageRouteHandler} />
      <ArrowLeftOnRectangleIcon
        className='w-8 cursor-pointer stroke-slate-600 hover:stroke-slate-300 transition-colors'
        onClick={logoutHandler} />
    </div>
  </div>
  )
}

export default function Main() {
  // const [userData, setUserData] = useState<User>()
  const navigate = useNavigate()

  const paths = [
    { path: 'tutorial', name: '튜토리얼' },
    { path: 'q1', name: '문제 1' },
    { path: 'q2', name: '문제 2' },
    { path: 'q3', name: '문제 3' },
    { path: 'q4', name: '문제 4' },
    { path: 'q5', name: '문제 5' }
  ]

  useEffect(() => {
    if (!isSignedIn()) navigate('/sign-in')
  }, [])
  // useEffect(() => {
    
  // }, [userData])

  return (
    isSignedIn() ? (
      <div className='h-full p-4 flex flex-col gap-4'>
        <HeaderMenu />

        <Routes>
          <Route path='*' element={<Navigate to='tutorial' />}></Route>
          { paths.map(({ path }) => (<Route key={path} path={path} element={<Content />}></Route>)) }
        </Routes>

        <div className="flex flex-col gap-y-4 mb-4">
          { paths.map(({ path, name }) => (<Button key={path} onClick={() => navigate(`/main/${path}`)}>{ name }</Button>)) }
        </div>
      </div>
    ) : null
  )
}
