import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"

export default function Content() {
  const [question, setQuestion] = useState<string>()
  const { pathname } = useLocation()

  const messageHandler = (e: MessageEvent) => {
    console.log(e);
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
