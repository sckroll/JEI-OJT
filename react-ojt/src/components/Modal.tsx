import { MouseEvent, ReactNode } from "react"
import { createPortal } from "react-dom"
import ModalData from "../types/modalData"
import Button from "./Button"

type OverlayPropTypes = {
  children: ReactNode
  onClick: () => void
}
type ModalPropTypes = {
  modalData: ModalData
}

const Overlay = ({ children, onClick }: OverlayPropTypes) => {
  return (
    <div
      onClick={onClick}
      className="absolute w-full h-full top-0 left-0 bg-black bg-opacity-30 flex justify-center items-center"
    >
      { children }
    </div>
  )
}

const ModalContainer = ({ modalData }: ModalPropTypes) => {
  const stopPropagationHandler = (e: MouseEvent) => {
    e.stopPropagation()
  }
  const buttonClickHandler = (e: MouseEvent) => {
    stopPropagationHandler(e)
    modalData.button.onClick()
  }

  return (
    <section onClick={stopPropagationHandler} className="p-8 bg-white rounded-md flex flex-col items-center gap-y-4 w-3/4 sm:w-64">
      <div className="flex flex-col items-center gap-y-2">
        <h1 className="text-xl font-bold text-slate-700">{ modalData.title }</h1>
        <p className="text-sm text-slate-400">{ modalData.content }</p>
      </div>
      <Button onClick={buttonClickHandler}>{ modalData.button.text }</Button>
    </section>
  )
}

export const Modal = ({ modalData }: ModalPropTypes) => {
  return createPortal((
    <Overlay onClick={modalData.overlay}>
      <ModalContainer modalData={modalData} />
    </Overlay>
  ), document.getElementById('modal')!)
}

export default Modal