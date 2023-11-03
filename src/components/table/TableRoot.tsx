import { HTMLAttributes } from 'react'

type TableProps = HTMLAttributes<HTMLDivElement>

export default function TableRoot({ children, ...props }: TableProps) {
  return (
    <div role="table" aria-rowcount={-1} {...props}>
      {children}
    </div>
  )
}
