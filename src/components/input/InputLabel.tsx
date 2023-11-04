'use client'

import { HTMLAttributes } from 'react'
import { inputStyles } from './Styles'
import useIdContext from '@/hooks/useIdContext'

type InputLabelProps = HTMLAttributes<HTMLLabelElement>

export default function InputLabel({ className, ...props }: InputLabelProps) {
  const { labelStyle } = inputStyles()
  const { id } = useIdContext()

  return <label htmlFor={id} className={labelStyle({ className })} {...props} />
}
