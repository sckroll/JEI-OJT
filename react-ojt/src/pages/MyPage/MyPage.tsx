import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { isSignedIn } from "../../api/auth"
import HeaderMenu from "../../components/HeaderMenu"

export default function MyPage() {
  const navigate = useNavigate()

  useEffect(() => {
    if (!isSignedIn()) navigate('/sign-in')
  }, [])

  return (
    isSignedIn() ? (
      <>
        <HeaderMenu />

        <div className="h-full flex justify-center items-center">
          준비 중 입니다.
        </div>
      </>
    ) : null
  )
}
