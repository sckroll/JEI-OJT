import { ChangeEvent, MouseEvent, ReactNode, useState } from "react"
import InputBox from "./InputBox"
import Button from "./Button"

type PropTypes = {
  children: ReactNode
}

const FormContainer = ({ children }: PropTypes) => {
  return (
    <form className="w-2/3 flex flex-col justify-center items-center p-4 gap-y-4">
      { children }
    </form>
  )
}

export default function LoginForm() {
  const [userInfo, setUserInfo] = useState({ id: '', password: '' })

  const onChange = ({ target }: ChangeEvent) => {
    if (target.id === 'user-id') setUserInfo({ ...userInfo, id: (target as HTMLInputElement).value })
    if (target.id === 'user-pw') setUserInfo({ ...userInfo, password: (target as HTMLInputElement).value })
  }
  const onClick = (e: MouseEvent) => {
    e.preventDefault()
    console.log(e);
  }

  return (
    <FormContainer>
      <InputBox id="user-id" placeholder="아이디" onChange={onChange} />
      <InputBox id="user-pw" type="password" placeholder="패스워드" onChange={onChange} />
      <Button type="submit" onClick={onClick}>로그인</Button>
    </FormContainer>
  )
}
