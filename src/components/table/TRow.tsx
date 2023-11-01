'use client'

import useTableContext from '@/hooks/TableContext'
import { HTMLAttributes, ReactNode } from 'react'
import { tv } from 'tailwind-variants'

const TrowStyle = tv({
  base: 'grid w-full cursor-pointer items-center justify-items-start gap-2 border-b border-zinc-300 p-1 hover:bg-zinc-100',
})

type TrowProps = {
  children: ReactNode
  className?: string
} & HTMLAttributes<HTMLButtonElement>

export default function Trow({ children, className, ...props }: TrowProps) {
  const { columns } = useTableContext()
  const templateColumns = columns.join(' ')

  return (
    <div className="w-full">
      <button
        className={TrowStyle({ className })}
        {...props}
        style={{
          gridTemplateColumns: templateColumns,
        }}
      >
        {children}
      </button>
    </div>
  )
}
