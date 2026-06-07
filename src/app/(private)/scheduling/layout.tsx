import { ReactNode } from 'react'
import { requireModuleAccess } from '@/lib/requireModuleAccess'

export default function SchedulingLayout({
  children,
}: {
  children: ReactNode
}) {
  requireModuleAccess('events')
  return children
}
