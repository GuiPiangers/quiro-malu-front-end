import { HTMLAttributes, ReactNode } from 'react'
import { tv } from 'tailwind-variants'

export const TrowStyle = tv({
  base: 'grid w-full items-center justify-items-start border-b px-2 py-1.5 hover:bg-zinc-100',
})

type TrowProps = {
  children: ReactNode
  className?: string
} & HTMLAttributes<HTMLDivElement>

export default function Trow({ children, className, ...props }: TrowProps) {
  return (
    <div className={TrowStyle({ className })} {...props}>
      {children}
    </div>
  )
}
