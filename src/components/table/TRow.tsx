'use client'

import useTableContext from '@/hooks/TableContext'
import { HTMLAttributes, ReactNode } from 'react'
import { tv } from 'tailwind-variants'

const TrowStyle = tv({
  base: 'contents',
})

type TrowProps = {
  children: ReactNode
  className?: string
} & HTMLAttributes<HTMLButtonElement>

export default function Trow({ children, className, ...props }: TrowProps) {
  return (
    <div className="w-full">
      <button className="contents" {...props}>
        {children}
      </button>
    </div>
  )
}
