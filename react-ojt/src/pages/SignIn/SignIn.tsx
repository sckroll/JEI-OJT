import { ReactNode } from "react"
import JEILogo from "../../components/JEILogo"
import LoginForm from "../../components/LoginForm"

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
  return (
    <SignInContainer>
      <JEILogo />
      <LoginForm />
    </SignInContainer>
  )
}
