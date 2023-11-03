import { HTMLAttributes } from 'react'
import { tableStyles } from './Style'

type THeadProps = HTMLAttributes<HTMLDivElement>

export default function THead({ children, className, ...props }: THeadProps) {
  const { TrowStyle } = tableStyles()

  return (
    <div {...props} className={TrowStyle({ className })} role="columnheader">
      {children}
    </div>
  )
}
