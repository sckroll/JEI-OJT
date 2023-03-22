import { MouseEvent, ReactNode } from "react"

type PropTypes = {
  type?: 'button' | 'submit' | 'reset',
  isCurrent?: boolean,
  isSuccess?: boolean,
  isFailure?: boolean,
  fullWidth? : boolean,
  children: ReactNode,
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void
}

const Button = ({
  type = 'button', isCurrent = false, isSuccess = false, isFailure = false, fullWidth = false, children, onClick
}: PropTypes) => {;
  let buttonColor = 'bg-blue-50 hover:bg-blue-100'

  if (isCurrent) {
    buttonColor = 'bg-slate-500 text-white cursor-default'
  } else {
    if (isSuccess) buttonColor = 'bg-teal-600 hover:bg-teal-700 text-white'
    else if (isFailure) buttonColor = 'bg-red-700 hover:bg-red-800 text-white'
  }

  return (
    <button
      type={type}
      onClick={isCurrent ? undefined : onClick}
      className={`w-full px-4 py-2 rounded-md ${buttonColor} ${fullWidth ? 'col-span-2' : ''} transition-colors`}>
      { children }
    </button>
  )
}

export default Button