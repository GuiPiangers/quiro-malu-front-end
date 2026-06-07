import { ReactNode } from 'react'
import { requireModuleAccess } from '@/lib/requireModuleAccess'

export default function FinanceLayout({ children }: { children: ReactNode }) {
  requireModuleAccess('finance')
  return children
}
