import { Outlet, useNavigate } from 'react-router-dom'
import Button from '../../components/Button'

export default function Main() {
  const navigate = useNavigate()

  return (
    <div className='p-4 flex flex-col gap-y-4'>
      <div className='flex justify-between'>
        <p>
          <strong className='font-bold'>김성찬</strong>
          님, 안녕하세요!
        </p>
        <div className='flex gap-x-2'>
          통계 페이지
          로그아웃
        </div>
      </div>
      <Button onClick={() => navigate('/main/q1')}>문제 1</Button>
      <Outlet />
    </div>
  )
}
