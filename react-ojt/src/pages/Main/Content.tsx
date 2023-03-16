import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"

type PropTypes = {
  onResult: (isSuccess: boolean) => void
}

export default function Content({ onResult }: PropTypes) {
  const [question, setQuestion] = useState<string>()
  const { pathname } = useLocation()

  const messageHandler = (e: MessageEvent) => {
    if (e.origin !== location.origin) return
    if (e.data.source === 'jei-contents') onResult(e.data.isSuccess)
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
