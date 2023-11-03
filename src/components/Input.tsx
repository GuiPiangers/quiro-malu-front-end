import { InputHTMLAttributes, ReactNode, useId } from 'react'
import { tv, VariantProps } from 'tailwind-variants'
import { PiWarningCircle } from 'react-icons/pi'

const inputStyles = tv({
  slots: {
    rootStyle: 'flex flex-col gap-1',
    labelStyle: 'text-sm font-medium',
    inputWrapperStyle:
      'flex gap-2 rounded border bg-white px-2 py-1 text-sm focus-within:outline focus-within:outline-1 focus-within:outline-blue-500 focus-within:ring-4 focus-within:ring-blue-50',
    inputFieldStyle: 'w-full select-none bg-transparent focus:outline-none',
    messageStyle: 'flex items-start gap-1 text-xs',
  },
  variants: {
    error: {
      true: {
        inputWrapperStyle:
          'bg-red-50 text-red-600 outline outline-1 outline-red-600 focus-within:bg-white focus-within:text-black focus-within:ring-red-50',
        inputFieldStyle: 'placeholder:text-red-300',
        messageStyle: 'text-red-600',
      },
    },
  },
  defaultVariants: {
    isFocus: false,
    error: false,
  },
})
type Variants = VariantProps<typeof inputStyles>
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
  className,
  ...props
}: InputProps) {
  const id = useId()
  const {
    rootStyle,
    inputWrapperStyle,
    inputFieldStyle,
    labelStyle,
    messageStyle,
  } = inputStyles({ error })

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

  return (
    <div className={rootStyle()}>
      <label htmlFor={id} className={labelStyle()}>
        {label}
      </label>

      <div className={inputWrapperStyle({ className })}>
        {leftIcon || null}

        <input {...props} id={id} className={inputFieldStyle()} />

        {rightIcon || null}
      </div>

      {ValidationMessage()}
    </div>
  )
}
