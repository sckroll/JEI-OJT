import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"

export default function Content() {
  const [question, setQuestion] = useState<string>()
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const messageHandler = (e: MessageEvent) => {
    if (e.origin !== location.origin) return
    if (e.data?.state === 'success') navigate('/main/q1')
  }

  useEffect(() => {
    window.addEventListener('message', messageHandler)
    return () => {
      window.removeEventListener('message', messageHandler)
    }
  }, [])
  useEffect(() => {
    setQuestion(pathname.split('/')[2])
  }, [pathname])
  
  return (
    <iframe src={`/contents/${question}/index.html`} className="w-full h-full"></iframe>
  )
}
