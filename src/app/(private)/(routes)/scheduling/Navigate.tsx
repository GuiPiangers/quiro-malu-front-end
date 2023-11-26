'use client'

import { useRouter } from 'next/navigation'
import { ReactNode } from 'react'

type NavigateProps = {
  children: ReactNode
  route: string
}

export default function Navigate({ children, route }: NavigateProps) {
  const router = useRouter()
  return <button onClick={() => router.replace(route)}>{children}</button>
}
