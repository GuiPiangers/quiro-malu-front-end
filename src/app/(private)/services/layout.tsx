import { ReactNode } from 'react'
import { requireModuleAccess } from '@/lib/requireModuleAccess'

export default function ServicesLayout({ children }: { children: ReactNode }) {
  requireModuleAccess('services')
  return children
}
