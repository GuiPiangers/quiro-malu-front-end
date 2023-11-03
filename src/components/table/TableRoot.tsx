import { ReactNode } from 'react'

type TableProps = {
  children: ReactNode
}

export default function TableRoot({ children }: TableProps) {
  return <div>{children}</div>
}
