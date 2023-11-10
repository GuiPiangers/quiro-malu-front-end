'use client'

import { HTMLAttributes } from 'react'
import useIdContext from '@/hooks/useIdContext'
import { VariantProps, tv } from 'tailwind-variants'

const labelStyle = tv({
  base: 'text-sm font-medium',
  variants: {
    required: {
      true: 'after:text-red-600 after:content-["*"]',
    },
  },
})

type InputLabelProps = HTMLAttributes<HTMLLabelElement> &
  VariantProps<typeof labelStyle>

export default function InputLabel({
  className,
  required,
  ...props
}: InputLabelProps) {
  const { id } = useIdContext()

  return (
    <label
      htmlFor={id}
      className={labelStyle({ required, className })}
      {...props}
    />
  )
}
