import { ButtonHTMLAttributes } from 'react'
import { tv, VariantProps } from 'tailwind-variants'

export const buttonStyle = tv({
  base: 'flex items-center justify-center gap-2 rounded px-4 py-1 transition',
  variants: {
    color: {
      primary: ' border-main bg-main text-main hover:bg-main-hover',
      blue: 'border-blue-600 bg-blue-600 text-blue-600 hover:bg-blue-700',
      green: 'border-green-600 bg-green-600 text-green-600 hover:bg-green-700',
      red: 'border-red-600 bg-red-600 text-red-600  hover:bg-red-700',
    },
    variant: {
      solid: 'border-none text-white',
      outline: 'border bg-transparent hover:text-white',
    },
    size: {
      small: 'px-2 text-xs font-medium',
    },
  },
  defaultVariants: {
    color: 'primary',
    variant: 'solid',
  },
  compoundVariants: [
    {
      variant: 'outline',
      color: 'red',
      className: 'hover:bg-red-600 ',
    },
    {
      variant: 'outline',
      color: 'blue',
      className: 'hover:bg-blue-600 ',
    },
    {
      variant: 'outline',
      color: 'green',
      className: 'hover:bg-green-600 ',
    },
    {
      variant: 'outline',
      color: 'primary',
      className: 'hover:bg-main ',
    },
  ],
})

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonStyle>

export default function Button({
  children,
  variant,
  color,
  className,
  size,
  ...props
}: ButtonProps) {
  return (
    <button
      className={buttonStyle({ variant, size, color, className })}
      {...props}
    >
      {children}
    </button>
  )
}
