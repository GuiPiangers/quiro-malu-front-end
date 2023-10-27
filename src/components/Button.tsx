import { ButtonHTMLAttributes } from 'react'
import { tv, VariantProps } from 'tailwind-variants'

const button = tv({
  base: 'py-1 flex items-center justify-center px-2 rounded transition',
  variants: {
    color: {
      primary:
        'bg-main border-main text-main hover:bg-main-hover hover:border-main-hover',
      edit: 'bg-blue-600 border-blue-600 text-blue-600 hover:bg-blue-700 hover:border-blue-700',
      save: 'bg-green-600 border-green-600 text-green-600 hover:bg-green-700 hover:border-green-700',
      remove:
        'bg-red-600 border-red-600 text-red-600 hover:bg-red-700 hover:border-red-700',
    },
    variant: {
      solid: 'border-none text-white',
      outline: 'border bg-transparent',
    },
  },
  defaultVariants: {
    color: 'primary',
    variant: 'solid',
  },
})

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof button>

export default function Button({
  children,
  variant,
  color,
  ...props
}: ButtonProps) {
  return (
    <button className={button({ variant, color })} {...props}>
      {children}
    </button>
  )
}
