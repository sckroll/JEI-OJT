import { ChangeEvent, MouseEvent, ReactNode, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import InputBox from "./InputBox"
import Button from "./Button"
import useUserList from "../hooks/useUserList"
import { signIn } from "../api/auth"
import Modal from "./Modal"
import ModalData from "../types/ModalData"

enum LoginFailureReasons {
  INVALID_ID,
  INVALID_PASSWORD,
  USER_NOT_FOUND,
  WRONG_PASSWORD,
  UNKNOWN
}
type PropTypes = {
  children: ReactNode
}
type SignInResult = {
  status: 'success' | 'failure',
  reason?: LoginFailureReasons
}

const FormContainer = ({ children }: PropTypes) => {
  return (
    <form className="w-3/4 flex flex-col justify-center items-center p-4 gap-y-4">
      { children }
    </form>
  )
}

export default function SignInForm() {
  const [formData, setFormData] = useState({ id: '', password: '' })
  const [signInResult, setSignInResult] = useState<SignInResult>({ status: 'failure', reason: LoginFailureReasons.UNKNOWN });
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
  const userList = useUserList()
  const navigate = useNavigate()

  const onChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    if (target.id === 'user-id') setFormData({ ...formData, id: target.value })
    if (target.id === 'user-pw') setFormData({ ...formData, password: target.value })
  }
  const onClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    
    const { status, reason } = signInResult
    if (status === 'success') {
      signIn(formData.id)
      navigate('/main')
    } else {
      let content
      if (reason === LoginFailureReasons.INVALID_ID) content = '아이디를 입력해주세요.'
      else if (reason === LoginFailureReasons.INVALID_PASSWORD) content = '비밀번호를 입력해주세요.'
      else if (reason === LoginFailureReasons.USER_NOT_FOUND) content = '올바르지 않은 아이디에요.'
      else if (reason === LoginFailureReasons.WRONG_PASSWORD) content = '비밀번호를 확인해주세요.'
      else content = '잠시 후에 다시 시도해주세요.'

      setModalData({
        ...modalData,
        content
      })
      setModal(true)
    }
  }
  
  useEffect(() => {
    if (!formData.id) {
      setSignInResult({ status: 'failure', reason: LoginFailureReasons.INVALID_ID })
      return
    }
    if (!formData.password) {
      setSignInResult({ status: 'failure', reason: LoginFailureReasons.INVALID_PASSWORD })
      return
    }

    const userData = userList?.find(user => user.id === formData.id)
    if (!userData) {
      setSignInResult({ status: 'failure', reason: LoginFailureReasons.USER_NOT_FOUND })
      return
    }

    const isWrongPassword = userData.password !== formData.password
    if (isWrongPassword) {
      setSignInResult({ status: 'failure', reason: LoginFailureReasons.WRONG_PASSWORD })
      return
    }

    setSignInResult({ status: 'success' })
  }, [formData])

  return (
    <>
      <FormContainer>
        <InputBox id="user-id" placeholder="아이디" onChange={onChange} />
        <InputBox id="user-pw" type="password" placeholder="패스워드" onChange={onChange} />
        <Button type="submit" onClick={onClick}>로그인</Button>
      </FormContainer>
      {modal && <Modal modalData={modalData} />}
    </>
  )
}
