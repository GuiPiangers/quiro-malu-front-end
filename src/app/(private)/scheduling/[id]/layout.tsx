import Link from 'next/link'
import { ReactNode } from 'react'

export default function layoutScheduling({
  children,
}: {
  children: ReactNode
}) {
  return <>{children}</>
}
