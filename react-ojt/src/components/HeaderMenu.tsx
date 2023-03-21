import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeftOnRectangleIcon, ChartBarIcon, PencilIcon } from '@heroicons/react/24/outline'
import { signOut } from '../api'

export default function HeaderMenu() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const myPageRouteHandler = () => {
    navigate('/my-page')
  }
  const mainPageRouteHandler = () => {
    navigate('/main/tutorial')
  }
  const logoutHandler = async () => {
    try {
      if (confirm('로그아웃 하시겠어요?')) {;
        signOut()
        navigate('/sign-in')
      }
    } catch (e) {
      console.error(e)
      alert('서버에 문제가 발생했습니다. 잠시 후에 다시 시도해주세요.')
    }
  }

  return (
    <div className='flex justify-between items-center'>
    <p>
      <strong className='font-bold'>김성찬</strong>님, 안녕하세요!
    </p>
    <div className='flex gap-x-2'>
      {
        pathname === '/my-page' ? (
          <PencilIcon
            className='w-8 cursor-pointer stroke-slate-600 hover:stroke-slate-300 transition-colors'
            onClick={mainPageRouteHandler} />
        ) : (
          <ChartBarIcon
            className='w-8 cursor-pointer stroke-slate-600 hover:stroke-slate-300 transition-colors'
            onClick={myPageRouteHandler} />
        )
      }
      <ArrowLeftOnRectangleIcon
        className='w-8 cursor-pointer stroke-slate-600 hover:stroke-slate-300 transition-colors'
        onClick={logoutHandler} />
    </div>
  </div>
  )
}
