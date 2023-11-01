import { ReactNode } from 'react'

type BoxProps = {
  children: ReactNode
}

export function Box({ children }: BoxProps) {
  return <div className="rounded-lg bg-white p-4 shadow">{children}</div>
}
