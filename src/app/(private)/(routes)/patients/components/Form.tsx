'use client'

import { FormHTMLAttributes, HTMLAttributes, ReactNode } from 'react'

import { Box } from '@/components/Box/Box'
import Button from '@/components/Button'

type FormProps = FormHTMLAttributes<HTMLFormElement>

export default function Form({ children, ...props }: FormProps) {
  return (
    <form className="w-full" {...props}>
      <Box className="m-auto max-w-screen-lg p-0">
        {children}
        <div className="sticky bottom-0 flex rounded-b-xl border-t border-slate-300 bg-white px-4 py-3">
          <Button color="green" className="w-40">
            Salvar
          </Button>
        </div>
      </Box>
    </form>
  )
}
