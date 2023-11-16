'use client'

import { LabelHTMLAttributes } from 'react'
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

type InputLabelProps = {
  notSave?: boolean
} & LabelHTMLAttributes<HTMLLabelElement> &
  VariantProps<typeof labelStyle>

export default function InputLabel({
  className,
  required,
  notSave,
  htmlFor,
  ...props
}: InputLabelProps) {
  const { id } = useIdContext()

  return (
    <div className="flex items-center">
      <label
        htmlFor={htmlFor || id}
        className={labelStyle({ required, className })}
        {...props}
      />
      {notSave && (
        <div className="mb-1 ml-3 rounded bg-blue-100 p-1 text-xs">
          Não salvo
        </div>
      )}
    </div>
  )
}
