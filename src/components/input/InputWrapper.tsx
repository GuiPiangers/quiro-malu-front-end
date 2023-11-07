'use client'

import { InputHTMLAttributes, ReactNode, forwardRef, useState } from 'react'
import { VariantProps } from 'tailwind-variants'
import { inputStyles } from './Styles'
import useIdContext from '@/hooks/useIdContext'
import { Slot } from '@radix-ui/react-slot'

export type InputVariants = VariantProps<typeof inputStyles>
export type InputFieldProps = {
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  asChild?: boolean
  focus?: boolean
} & InputHTMLAttributes<HTMLDivElement> &
  Omit<InputVariants, 'focus'>

export const InputWrapper = (
  {
    asChild,
    className,
    error,
    disabled,
    leftIcon,
    rightIcon,
    children,
    focus,
    ...props
  }: InputFieldProps,
  ref: any,
) => {
  const { inputWrapperStyle } = inputStyles({
    disabled,
    error,
    focus,
  })

  return (
    <div className={inputWrapperStyle({ className })} ref={ref} {...props}>
      {leftIcon || null}
      {children}
      {rightIcon || null}
    </div>
  )
}

export default forwardRef(InputWrapper)
