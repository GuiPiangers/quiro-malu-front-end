'use client'

import Button from '@/components/Button'
import { error } from 'console'
import { ForwardedRef, forwardRef, InputHTMLAttributes, useId } from 'react'
import { tv, VariantProps } from 'tailwind-variants'

export const fileInputStyle = tv({
  base: 'flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed bg-transparent px-2 py-1 text-xs font-medium transition hover:bg-slate-100 disabled:border-slate-300 disabled:bg-transparent disabled:text-slate-400',
  variants: {
    color: {
      primary: ' border-main text-main',
      blue: 'border-blue-600  text-blue-600',
      green: 'border-green-600  text-green-600',
      red: 'border-red-600  text-red-600 ',
      black: 'border-slate-800  text-black ',
    },
    error: {
      true: 'border-red-600  text-red-600',
    },
  },
  defaultVariants: {
    color: 'primary',
  },
})

export type FileInputPropsVariants = VariantProps<typeof fileInputStyle>

function _FileInput(
  {
    children,
    color,
    error,
    className,
    ...props
  }: InputHTMLAttributes<HTMLInputElement> & FileInputPropsVariants,
  ref: ForwardedRef<HTMLInputElement>,
) {
  const inputId = useId()
  return (
    <>
      <label
        htmlFor={inputId}
        className={fileInputStyle({ color, error, className })}
      >
        {children}
      </label>

      <input
        id={inputId}
        type="file"
        {...props}
        ref={ref}
        className="absolute h-0 w-0 opacity-0"
      />
    </>
  )
}

export const FileInput = forwardRef(_FileInput)
