import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"

type PropTypes = {
  onNextPath: () => void
}

export default function Content({ onNextPath }: PropTypes) {
  const [question, setQuestion] = useState<string>()
  const { pathname } = useLocation()

  const messageHandler = (e: MessageEvent) => {
    if (e.origin !== location.origin) return
    if (e.data?.state === 'success') onNextPath()
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
