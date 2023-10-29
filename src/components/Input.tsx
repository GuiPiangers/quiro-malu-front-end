'use client'
import { InputHTMLAttributes, ReactNode, useId, useState } from 'react'
import { tv, VariantProps } from 'tailwind-variants'
import { PiWarningCircle } from 'react-icons/pi'

const inputStyle = tv({
  slots: {
    rootStyle: 'flex flex-col gap-1',
    labelStyle: 'font-medium text-sm',
    inputWrapperStyle: 'px-2 py-1 rounded border flex gap-1 bg-white',
    inputFieldStyle:
      'bg-transparent text-sm w-full focus:outline-none select-none',
    messageStyle: 'text-xs flex items-start gap-1',
  },
  variants: {
    isFocus: {
      true: {
        inputWrapperStyle:
          'ring-4 ring-blue-50 outline outline-1 outline-blue-500',
      },
    },
    error: {
      true: {
        inputWrapperStyle:
          'bg-red-50 outline outline-1 outline-red-600 text-red-600',
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
        inputWrapperStyle: ' ring-red-50 bg-white text-black',
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
  name?: string
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  error?: boolean
  message?: string
} & InputHTMLAttributes<HTMLInputElement> &
  Omit<Variants, 'isFocus'>

export default function Input({
  name,
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
        {name}
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
