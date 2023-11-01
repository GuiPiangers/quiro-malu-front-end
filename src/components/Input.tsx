'use client'
import { InputHTMLAttributes, ReactNode, useId, useState } from 'react'
import { tv, VariantProps } from 'tailwind-variants'
import { PiWarningCircle } from 'react-icons/pi'

const inputStyle = tv({
  slots: {
    rootStyle: 'flex flex-col gap-1',
    labelStyle: 'text-sm font-medium',
    inputWrapperStyle: 'flex gap-1 rounded border bg-white px-2 py-1',
    inputFieldStyle:
      'w-full select-none bg-transparent text-sm focus:outline-none',
    messageStyle: 'flex items-start gap-1 text-xs',
  },
  variants: {
    isFocus: {
      true: {
        inputWrapperStyle:
          'outline outline-1 outline-blue-500 ring-4 ring-blue-50',
      },
    },
    error: {
      true: {
        inputWrapperStyle:
          'bg-red-50 text-red-600 outline outline-1 outline-red-600',
        inputFieldStyle: 'placeholder:text-red-300',
        messageStyle: 'text-red-600',
      },
    },
  },
  compoundVariants: [
    {
      isFocus: true,
      error: true,
      className: {
        inputWrapperStyle: ' bg-white text-black ring-red-50',
        inputFieldStyle: 'placeholder:text-',
      },
    },
  ],
  defaultVariants: {
    isFocus: false,
    error: false,
  },
})
type Variants = VariantProps<typeof inputStyle>
type InputProps = {
  label?: string
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  error?: boolean
  message?: string
} & InputHTMLAttributes<HTMLInputElement> &
  Omit<Variants, 'isFocus'>

export default function Input({
  label,
  leftIcon,
  rightIcon,
  message,
  error,
  ...props
}: InputProps) {
  const [isFocus, setIsFocus] = useState<Variants['isFocus']>(false)
  const id = useId()
  const {
    rootStyle,
    inputWrapperStyle,
    inputFieldStyle,
    labelStyle,
    messageStyle,
  } = inputStyle({ isFocus, error })

  const ValidationMessage = () => {
    if (message) {
      return (
        <div className={messageStyle()}>
          {error && <PiWarningCircle size={16} />}
          <span>{message}</span>
        </div>
      )
    }
  }

  const handleFocusTrue = () => {
    setIsFocus(true)
  }
  const handleFocusFalse = () => {
    setIsFocus(false)
  }

  return (
    <div className={rootStyle()}>
      <label htmlFor={id} className={labelStyle()}>
        {label}
      </label>

      <div className={inputWrapperStyle()}>
        {leftIcon || null}

        <input
          {...props}
          id={id}
          className={inputFieldStyle()}
          onFocus={handleFocusTrue}
          onBlur={handleFocusFalse}
        />

        {rightIcon || null}
      </div>

      {ValidationMessage()}
    </div>
  )
}
