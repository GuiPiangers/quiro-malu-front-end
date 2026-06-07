'use client'

import { createContext, ReactNode, useContext } from 'react'
import { ResolvedPermission } from '@/types/permissions'

const PermissionsContext = createContext<ResolvedPermission[]>([])

export function PermissionsProvider({
  permissions,
  children,
}: {
  permissions: ResolvedPermission[]
  children: ReactNode
}) {
  return (
    <PermissionsContext.Provider value={permissions}>
      {children}
    </PermissionsContext.Provider>
  )
}

export function usePermissions() {
  return useContext(PermissionsContext)
}
