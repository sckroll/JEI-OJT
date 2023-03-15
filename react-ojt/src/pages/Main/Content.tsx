import { useLocation } from "react-router-dom"

export default function Content() {
  const { pathname } = useLocation()
  
  return (
    <div>{ pathname }</div>
  )
}
