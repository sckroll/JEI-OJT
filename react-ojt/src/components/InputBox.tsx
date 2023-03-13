import { ChangeEvent } from "react"

type PropTypes = {
  id: string,
  type?: string,
  placeholder?: string,
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
}

const InputBox = ({ id, type = 'text', placeholder = '', onChange }: PropTypes) => {
  return (
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      onChange={onChange}
      className="w-full p-2 border-slate-200 border-solid border-2 rounded-md"
    />
  )
}

export default InputBox