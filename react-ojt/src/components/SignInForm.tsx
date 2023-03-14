import { ChangeEvent, MouseEvent, ReactNode, useEffect, useState } from "react"
import InputBox from "./InputBox"
import Button from "./Button"
import useUserList from "../hooks/useUserList"
import { signIn } from "../api/auth"

type PropTypes = {
  children: ReactNode
}
type SignInResult = {
  status: 'success' | 'failure',
  reason?: string
}

const FormContainer = ({ children }: PropTypes) => {
  return (
    <form className="w-2/3 flex flex-col justify-center items-center p-4 gap-y-4">
      { children }
    </form>
  )
}

export default function SignInForm() {
  const [formData, setFormData] = useState({ id: '', password: '' })
  const [signInResult, setSignInResult] = useState<SignInResult>({ status: 'failure', reason: 'invalid form' })
  const userList = useUserList()

  const onChange = ({ target }: ChangeEvent) => {
    if (target.id === 'user-id') setFormData({ ...formData, id: (target as HTMLInputElement).value })
    if (target.id === 'user-pw') setFormData({ ...formData, password: (target as HTMLInputElement).value })
  }
  const onClick = (e: MouseEvent) => {
    e.preventDefault()
    const { status, reason } = signInResult
    if (status === 'success') {
      signIn(formData.id)
    } else {
      console.log(reason)
    }
  }
  
  useEffect(() => {
    if (!formData.id) {
      setSignInResult({ status: 'failure', reason: 'invalid id' })
      return
    }
    if (!formData.password) {
      setSignInResult({ status: 'failure', reason: 'invalid password' })
      return
    }

    const userData = userList?.find(user => user.id === formData.id)
    if (!userData) {
      setSignInResult({ status: 'failure', reason: 'user not found' })
      return
    }

    const isWrongPassword = userData.password !== formData.password
    if (isWrongPassword) {
      setSignInResult({ status: 'failure', reason: 'wrong password' })
      return
    }

    setSignInResult({ status: 'success' })
  }, [formData])

  return (
    <FormContainer>
      <InputBox id="user-id" placeholder="아이디" onChange={onChange} />
      <InputBox id="user-pw" type="password" placeholder="패스워드" onChange={onChange} />
      <Button type="submit" onClick={onClick}>로그인</Button>
    </FormContainer>
  )
}
