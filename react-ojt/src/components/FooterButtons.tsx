import { ReactNode, useContext } from 'react'
import ContentContext from '../context'
import Button from './Button'

type FooterButtonsFrops = {
  contentIdx: number,
  onClick: (idx: number) => void
}
type ButtonWrapperProps = {
  children: ReactNode
}

const ButtonWrapper = ({ children }: ButtonWrapperProps) => {
  return (
    <div className="grid grid-cols-2 gap-3 mb-4">
      { children }
    </div>
  )
}

export default function FooterButtons({ contentIdx, onClick }: FooterButtonsFrops) {
  const contentState = useContext(ContentContext)
  
  return (
    <ButtonWrapper>
      { contentState.map(({ id, name, state }, idx) => (
        <Button
          key={id}
          isCurrent={id === contentIdx}
          isSuccess={state === 'success'}
          isFailure={state === 'failure'}
          fullWidth={id === 0}
          onClick={() => onClick(idx)}>
            { name }
        </Button>
      )) }
    </ButtonWrapper>
  )
}
