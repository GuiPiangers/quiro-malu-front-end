'use client'

import { ButtonHTMLAttributes, MouseEvent } from 'react'
import { tv, VariantProps } from 'tailwind-variants'
import { Slot } from '@radix-ui/react-slot'

export const buttonStyle = tv({
  base: 'flex items-center justify-center gap-2 rounded-lg px-6 py-2 text-sm transition',
  variants: {
    color: {
      primary: ' border-main bg-main text-main hover:bg-main-hover',
      blue: 'border-blue-600 bg-blue-600 text-blue-600 hover:bg-blue-700',
      green: 'border-green-600 bg-green-600 text-green-600 hover:bg-green-700',
      red: 'border-red-600 bg-red-600 text-red-600  hover:bg-red-700',
      black: 'border-slate-800 bg-slate-800 text-black  hover:bg-slate-900',
    },
    variant: {
      solid: 'border-none text-white disabled:bg-slate-400 ',
      outline:
        'border bg-transparent hover:text-white disabled:border-slate-300 disabled:bg-transparent disabled:text-slate-400',
    },
    size: {
      small: 'rounded-md px-2 py-1 text-xs font-medium',
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
    {
      variant: 'outline',
      color: 'black',
      className: 'hover:bg-slate-100 hover:text-black',
    },
  ],
})

export type ButtonPropsVariants = VariantProps<typeof buttonStyle>

type ButtonProps = {
  asChild?: boolean
} & ButtonHTMLAttributes<HTMLButtonElement> &
  ButtonPropsVariants

export default function Button({
  children,
  variant,
  color,
  className,
  asChild,
  size,
  onClick,
  ...props
}: ButtonProps) {
  const Element = asChild ? Slot : 'button'
  return (
    <Element
      onClick={(e: MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation()
        if (onClick) onClick(e)
      }}
      className={buttonStyle({ variant, size, color, className })}
      {...props}
    >
      {children}
    </Element>
  )
}
