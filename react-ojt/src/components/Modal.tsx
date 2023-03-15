import { ReactNode } from "react"
import { createPortal } from "react-dom"
import ModalData from "../types/modalData"
import Button from "./Button"

type OverlayPropTypes = {
  children: ReactNode
}
type ModalPropTypes = {
  modalData: ModalData
}

const Overlay = ({ children }: OverlayPropTypes) => {
  return (
    <div className="absolute w-full h-full top-0 left-0 bg-black bg-opacity-30 flex justify-center items-center">
      { children }
    </div>
  )
}

const ModalContainer = ({ modalData }: ModalPropTypes) => {
  return (
    <section className="p-8 bg-white rounded-md flex flex-col items-center gap-y-4 w-3/4 sm:w-64">
      <div className="flex flex-col items-center gap-y-2">
        <h1 className="text-xl font-bold text-slate-700">{ modalData.title }</h1>
        <p className="text-sm text-slate-400">{ modalData.content }</p>
      </div>
      <Button onClick={modalData.button.onClick}>{ modalData.button.text }</Button>
    </section>
  )
}

export const Modal = ({ modalData }: ModalPropTypes) => {
  return createPortal((
    <Overlay>
      <ModalContainer modalData={modalData} />
    </Overlay>
  ), document.getElementById('modal')!)
}

export default Modal