import { HTMLAttributes } from 'react'
import { VariantProps } from 'tailwind-variants'
import { inputStyles } from './Styles'

type Variants = VariantProps<typeof inputStyles>
type InputMessageProps = HTMLAttributes<HTMLInputElement> &
  Omit<Variants, 'disabled'>

export default function InputMessage({
  className,
  error,
  children,
  ...props
}: InputMessageProps) {
  const { messageStyle } = inputStyles({
    error,
  })

  return (
    <span {...props} className={messageStyle({ className })}>
      {children}
    </span>
  )
}
