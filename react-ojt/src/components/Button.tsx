import { MouseEvent, ReactNode } from "react"

type PropTypes = {
  type?: 'button' | 'submit' | 'reset',
  children: ReactNode,
  onClick: (e: MouseEvent<HTMLButtonElement>) => void
}

const Button = ({ type = 'button', children, onClick }: PropTypes) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className='w-full px-4 py-2 rounded-md bg-blue-50 hover:bg-blue-100 transition-colors'>
      { children }
    </button>
  )
}

export default Button