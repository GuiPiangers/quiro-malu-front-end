'use client'

import { InputHTMLAttributes, ReactNode } from 'react'
import { VariantProps } from 'tailwind-variants'
import { inputStyles } from './Styles'
import useIdContext from '@/hooks/useIdContext'

type Variants = VariantProps<typeof inputStyles>
type InputFieldProps = {
  leftIcon?: ReactNode
  rightIcon?: ReactNode
} & InputHTMLAttributes<HTMLInputElement> &
  Variants

export default function InputField({
  className,
  error,
  disabled,
  leftIcon,
  type,
  rightIcon,
  ...props
}: InputFieldProps) {
  const { id } = useIdContext()

  const { inputWrapperStyle, inputFieldStyle } = inputStyles({
    disabled,
    error,
  })

  return (
    <div className={inputWrapperStyle({ className })}>
      {leftIcon || null}
      <input id={id} {...props} className={inputFieldStyle()} />
      {rightIcon || null}
    </div>
  )
}
