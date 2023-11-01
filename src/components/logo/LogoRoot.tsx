import { ReactNode } from 'react'

type LogoRootProps = {
  children: ReactNode
}

export function LogoRoot({ children }: LogoRootProps) {
  return <div className="flex items-center">{children}</div>
}
