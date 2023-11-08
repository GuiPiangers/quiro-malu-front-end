'use client'

import { HTMLAttributes } from 'react'
import useIdContext from '@/hooks/useIdContext'
import { twMerge } from 'tailwind-merge'

type InputLabelProps = HTMLAttributes<HTMLLabelElement>

export default function InputLabel({ className, ...props }: InputLabelProps) {
  const { id } = useIdContext()

  return (
    <label
      htmlFor={id}
      className={twMerge('text-sm font-medium', className)}
      {...props}
    />
  )
}
