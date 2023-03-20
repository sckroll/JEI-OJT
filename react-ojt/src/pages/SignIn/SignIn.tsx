import { ReactNode, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { isSignedIn } from "../../api/auth"
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
  const navigate = useNavigate()

  useEffect(() => {
    if (isSignedIn()) navigate('/main')
  }, [])

  if (!isSignedIn()) {
    return (
      <SignInContainer>
        <JEILogo />
        <SignInForm />
      </SignInContainer>
    )
  }
  return null
}
