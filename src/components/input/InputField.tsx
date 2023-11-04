'use client'

import { InputHTMLAttributes, ReactNode, forwardRef } from 'react'
import { VariantProps } from 'tailwind-variants'
import { inputStyles } from './Styles'
import useIdContext from '@/hooks/useIdContext'

export type InputVariants = VariantProps<typeof inputStyles>
type InputFieldProps = {
  leftIcon?: ReactNode
  rightIcon?: ReactNode
} & InputHTMLAttributes<HTMLInputElement> &
  InputVariants

export const InputField = (
  {
    className,
    error,
    disabled,
    leftIcon,
    rightIcon,
    ...props
  }: InputFieldProps,
  ref: any,
) => {
  const { id } = useIdContext()
  const { inputWrapperStyle, inputFieldStyle } = inputStyles({
    disabled,
    error,
  })

  return (
    <div className={inputWrapperStyle({ className })}>
      {leftIcon || null}
      <input id={id} ref={ref} {...props} className={inputFieldStyle()} />
      {rightIcon || null}
    </div>
  )
}

export default forwardRef(InputField)
