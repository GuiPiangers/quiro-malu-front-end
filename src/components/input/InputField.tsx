'use client'

import {
  ChangeEvent,
  InputHTMLAttributes,
  ReactNode,
  forwardRef,
  useState,
} from 'react'
import { VariantProps } from 'tailwind-variants'
import { inputStyles } from './Styles'
import useIdContext from '@/hooks/useIdContext'
import { Slot } from '@radix-ui/react-slot'
import InputWrapper from './InputWrapper'
import Phone from '@/utils/Phone'
import Cpf from '@/utils/Cpf'

export type InputVariants = VariantProps<typeof inputStyles>
export type InputFieldProps = {
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  asChild?: boolean
} & InputHTMLAttributes<HTMLInputElement> &
  Omit<InputVariants, 'focus'>

export const InputField = (
  {
    asChild,
    className,
    error,
    disabled,
    leftIcon,
    rightIcon,
    ...props
  }: InputFieldProps,
  ref: any,
) => {
  const [focus, setFocus] = useState(false)
  const [value, setValue] = useState('')
  const { id } = useIdContext()
  const { inputWrapperStyle, inputFieldStyle } = inputStyles({
    disabled,
    error,
    focus,
  })
  const Element = asChild ? Slot : 'input'

  return (
    <InputWrapper
      className={inputWrapperStyle({ className })}
      error={error}
      disabled={disabled}
      leftIcon={leftIcon}
      rightIcon={rightIcon}
    >
      <Element
        id={id}
        ref={ref}
        {...props}
        className={inputFieldStyle()}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
      />
    </InputWrapper>
  )
}

export default forwardRef(InputField)
