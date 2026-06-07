import { ReactNode } from 'react'
import { requireModuleAccess } from '@/lib/requireModuleAccess'

export default function PatientsLayout({ children }: { children: ReactNode }) {
  requireModuleAccess('patients')
  return children
}
