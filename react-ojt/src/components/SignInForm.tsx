import { ChangeEvent, MouseEvent, ReactNode, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { isAxiosError } from "axios"
import InputBox from "./InputBox"
import Button from "./Button"
import Modal from "./Modal"
import ModalData from "../types/ModalData"
import { signIn } from "../api"
import { AuthForm } from "../types/User"

type PropTypes = {
  children: ReactNode
}

const FormContainer = ({ children }: PropTypes) => {
  return (
    <form className="w-3/4 flex flex-col justify-center items-center p-4 gap-y-4">
      { children }
    </form>
  )
}

export default function SignInForm() {
  const [formData, setFormData] = useState<AuthForm>({ id: '', password: '' })
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [modal, setModal] = useState(false)
  const [modalData, setModalData] = useState<ModalData>({
    title: '로그인 실패',
    content: '',
    button: {
      text: '확인',
      onClick() {
        setModal(false)
      }
    },
    overlay() {
      setModal(false)
    },
  })
  const navigate = useNavigate()

  const onChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    if (target.id === 'user-id') setFormData({ ...formData, id: target.value })
    if (target.id === 'user-pw') setFormData({ ...formData, password: target.value })
  }
  const onClick = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    try {
      const response = await signIn(formData)
      setIsSignedIn(response)
    } catch (e) {
      console.error(e)

      let content = '서버에 문제가 발생했습니다. 잠시 후에 다시 시도해주세요.'
      if (isAxiosError(e) && e.response?.data) content = e.response.data

      setModalData({ ...modalData, content })
      setModal(true)
    }
  }

  useEffect(() => {
    if (isSignedIn) navigate('/main/tutorial')
  }, [isSignedIn])

  return (
    <>
      <FormContainer>
        <InputBox id="user-id" placeholder="아이디" onChange={onChange} />
        <InputBox id="user-pw" type="password" placeholder="패스워드" onChange={onChange} />
        <Button type="submit" onClick={onClick}>로그인</Button>
      </FormContainer>
      { modal && <Modal modalData={modalData} /> }
    </>
  )
}
