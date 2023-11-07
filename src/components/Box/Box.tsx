import { HTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'

type BoxProps = { asChild?: boolean } & HTMLAttributes<HTMLDivElement>

export function Box({ children, className, asChild, ...props }: BoxProps) {
  return (
    <div
      {...props}
      className={twMerge('rounded-xl bg-white p-4 shadow', className)}
    >
      {children}
    </div>
  )
}
