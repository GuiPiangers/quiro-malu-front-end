import { HTMLAttributes } from 'react'
import { tableStyles } from './Style'

type THeadProps = HTMLAttributes<HTMLDivElement>

export default function THead({ children, className, ...props }: THeadProps) {
  const { THeadStyle } = tableStyles()

  return (
    <div {...props} className={THeadStyle({ className })} role="columnheader">
      {children}
    </div>
  )
}
