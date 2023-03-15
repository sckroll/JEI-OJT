import { MouseEvent } from "react"

type ModalData = {
  title: string,
  content: string,
  button: {
    text: string,
    onClick: () => void
  },
  overlay: () => void
}
export default ModalData