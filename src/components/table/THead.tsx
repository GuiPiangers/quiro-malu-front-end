import { ReactNode } from 'react'

type THeadProps = {
  children: ReactNode
}

export default function THead({ children }: THeadProps) {
  return <div>{children}</div>
}
