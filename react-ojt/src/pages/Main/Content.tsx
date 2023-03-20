import { useEffect, useState } from "react"
import { useNavigate, useOutletContext } from "react-router-dom"
import { isSignedIn } from "../../api/auth"
import { paths } from "../../config"

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
    if (!isSignedIn()) {
      navigate('/sign-in')
      return
    }

    window.addEventListener('message', messageHandler)
    return () => {
      window.removeEventListener('message', messageHandler)
    }
  }, [])
  useEffect(() => {
    navigate(`/main/${contentIdx >= paths.length ? 'clear' : paths[contentIdx].path}`)
  }, [contentIdx])
  useEffect(() => {
    setContentIdx(idx)
  }, [idx])
  
  if (contentIdx < paths.length) {
    return (
      <iframe src={`/contents/${paths[contentIdx].path}/index.html`} className="w-full h-full"></iframe>
    )
  }
  return null
}
