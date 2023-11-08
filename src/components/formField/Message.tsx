import { HTMLAttributes } from 'react'
import { VariantProps, tv } from 'tailwind-variants'

const messageStyle = tv({
  base: 'flex items-start gap-1 text-xs',
  variants: {
    error: {
      true: 'text-red-600',
    },
  },
})

type Variants = VariantProps<typeof messageStyle>
type InputMessageProps = HTMLAttributes<HTMLInputElement> & Variants

export default function InputMessage({
  className,
  error,
  children,
  ...props
}: InputMessageProps) {
  return (
    <span {...props} className={messageStyle({ error, className })}>
      {children}
    </span>
  )
}
