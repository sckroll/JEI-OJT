import { useEffect, useState } from "react"
import { useNavigate, useOutletContext } from "react-router-dom"
import { authCheck } from "../../api"
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
    if (!authCheck()) {
      navigate('/sign-in')
      return
    }

    window.addEventListener('message', messageHandler)
    return () => {
      window.removeEventListener('message', messageHandler)
    }
  }, [])
  useEffect(() => {
    setContentIdx(idx)
  }, [idx])
  useEffect(() => {
    navigate(`/main/${contentIdx >= paths.length ? 'clear' : paths[contentIdx].path}`)
  }, [contentIdx])
  
  if (contentIdx < paths.length) {
    return (
      <iframe src={`/contents/${paths[contentIdx].path}/index.html`} className="w-full h-full"></iframe>
    )
  }
  return null
}
