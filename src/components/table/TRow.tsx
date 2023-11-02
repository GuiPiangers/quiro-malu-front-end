'use client'

import { HTMLAttributes, ReactNode } from 'react'
import { tv } from 'tailwind-variants'

const TrowStyle = tv({
  base: 'grid w-full items-center justify-items-start border-b px-2 py-1.5 hover:bg-zinc-100',
})

type TrowProps = {
  children: ReactNode
  className?: string
} & HTMLAttributes<HTMLButtonElement>

export default function Trow({ children, className, ...props }: TrowProps) {
  return (
    <button className={TrowStyle({ className })} {...props}>
      {children}
    </button>
  )
}
