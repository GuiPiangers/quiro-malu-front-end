'use client'

import { FormHTMLAttributes, ReactNode } from 'react'

import { Box } from '@/components/Box/Box'
import Button from '@/components/Button'
import { twMerge } from 'tailwind-merge'

export type FormProps = {
  buttons?: ReactNode
  btWrapperClassName?: string
} & Omit<FormHTMLAttributes<HTMLFormElement>, 'action'>

export default function Form({
  children,
  className,
  buttons,
  btWrapperClassName,
  ...props
}: FormProps) {
  return (
    <form className="w-full" {...props}>
      <Box className={twMerge('m-auto max-w-screen-lg p-0', className)}>
        {children}
        <div
          className={twMerge(
            'sticky bottom-0 flex gap-4 rounded-b-xl border-t border-slate-300 bg-white px-4 py-3',
            btWrapperClassName,
          )}
        >
          {buttons || (
            <Button color="green" className="w-40">
              Salvar
            </Button>
          )}
        </div>
      </Box>
    </form>
  )
}
