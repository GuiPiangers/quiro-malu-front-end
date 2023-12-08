'use client'

import { useRouter } from 'next/navigation'
import { ReactNode } from 'react'

type NavigateProps = {
  children: ReactNode
  route: string
  className?: string
}

export default function RouteReplace({
  children,
  route,
  className,
}: NavigateProps) {
  const router = useRouter()
  return (
    <button className={className} onClick={() => router.replace(route)}>
      {children}
    </button>
  )
}
