import { useEffect, useState } from "react"
import { useNavigate, useOutletContext } from "react-router-dom"
import { initialContents } from "../../config"

type PropTypes = {
  idx: number
}

export default function Content() {
  const navigate = useNavigate()
  const { idx } = useOutletContext<PropTypes>()
  const [contentIdx, setContentIdx] = useState(idx)

  const messageHandler = (e: MessageEvent) => {
    if (e.origin !== location.origin) return
    if (e.data.source === 'jei-contents') {
      setContentIdx(n => n + 1)
    }
  }

  useEffect(() => {
    window.addEventListener('message', messageHandler)
    return () => {
      window.removeEventListener('message', messageHandler)
    }
  }, [])
  useEffect(() => {
    setContentIdx(idx)
  }, [idx])
  useEffect(() => {
    navigate(`/main/${contentIdx >= initialContents.length ? 'clear' : initialContents[contentIdx].path}`)
  }, [contentIdx])
  
  if (contentIdx >= initialContents.length) return null
  return (
    <iframe src={`/contents/${initialContents[contentIdx].path}/index.html`} className="w-full h-full"></iframe>
  )
  
}
