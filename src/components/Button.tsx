import { ButtonHTMLAttributes } from 'react'
import { tv, VariantProps } from 'tailwind-variants'

export const buttonStyle = tv({
  base: 'flex items-center justify-center rounded px-2 py-1 transition',
  variants: {
    color: {
      primary:
        'border-main bg-main text-main hover:border-main-hover hover:bg-main-hover',
      edit: 'border-blue-600 bg-blue-600 text-blue-600 hover:border-blue-700 hover:bg-blue-700',
      save: 'border-green-600 bg-green-600 text-green-600 hover:border-green-700 hover:bg-green-700',
      remove:
        'border-red-600 bg-red-600 text-red-600 hover:border-red-700 hover:bg-red-700',
    },
    variant: {
      solid: 'border-none text-white',
      outline: 'border bg-transparent hover:text-white',
    },
  },
  defaultVariants: {
    color: 'primary',
    variant: 'solid',
  },
})

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonStyle>

export default function Button({
  children,
  variant,
  color,
  className,
  ...props
}: ButtonProps) {
  return (
    <button className={buttonStyle({ variant, color, className })} {...props}>
      {children}
    </button>
  )
}
