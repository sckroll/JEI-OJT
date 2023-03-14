import { ReactNode } from "react"
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
  return (
    <SignInContainer>
      <JEILogo />
      <SignInForm />
    </SignInContainer>
  )
}
