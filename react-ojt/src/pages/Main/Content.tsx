import { useEffect, useState } from "react"
import { useNavigate, useOutletContext } from "react-router-dom"
import { getContentState, updateContentState } from "../../api"
import { initialContents } from "../../config"

type PropTypes = {
  idx: number
}

export default function Content() {
  const navigate = useNavigate()
  const { idx } = useOutletContext<PropTypes>()
  const [contentIdx, setContentIdx] = useState(idx)

  const messageHandler = async (e: MessageEvent) => {
    if (e.origin !== location.origin) return
    if (e.data.source === 'jei-contents') {
      try {
        const prevContentState = await getContentState()
        prevContentState[contentIdx].state = e.data.isSuccess ? 'success' : 'failure'
        await updateContentState(prevContentState)
        setContentIdx(n => n + 1)
      } catch (e) {
        console.error(e)
        alert('서버에 문제가 발생했습니다. 잠시 후에 다시 시도해주세요.')
      }
    }
  }
  
  useEffect(() => {
    setContentIdx(idx)
  }, [idx])
  useEffect(() => {
    window.addEventListener('message', messageHandler)
    navigate(`/main/${contentIdx >= initialContents.length ? 'clear' : initialContents[contentIdx].path}`)

    return () => {
      window.removeEventListener('message', messageHandler)
    }
  }, [contentIdx])
  
  if (contentIdx >= initialContents.length) return null
  return (
    <iframe src={`/contents/${initialContents[contentIdx].path}/index.html`} className="w-full h-2/3"></iframe>
  )
}