import { ReactNode, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { authCheck } from "../../api"
import JEILogo from "../../components/JEILogo"
import SignInForm from "../../components/SignInForm"

type PropTypes = {
  children: ReactNode
}

const SignInContainer = ({ children }: PropTypes) => {
  return (
    <div className="h-screen flex flex-col justify-center items-center gap-y-16">
      { children }
    </div>
  )
}

export default function SignIn() {
  const [isSignedIn, setIsSignedIn] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const chackAuthState = async () => {
      const authCheckResult = await authCheck()
      setIsSignedIn(authCheckResult)
    }
    chackAuthState()
    if (isSignedIn) navigate('/main');
  }, [])

  if (isSignedIn) return null
  return (
    <SignInContainer>
      <JEILogo />
      <SignInForm />
    </SignInContainer>
  )
}
