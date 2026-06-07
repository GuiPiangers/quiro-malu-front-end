'use client'

import { usePermissions } from '@/contexts/PermissionsContext'
import { PermissionKey } from '@/types/permissions'
import { hasModuleAccess, type PermissionModule } from '@/lib/permissions'

export type { PermissionModule }

export function useAccess(requiredKey: PermissionKey) {
  const permissions = usePermissions()
  return permissions.some((permission) => permission.key === requiredKey)
}

export function useModuleAccess(module: PermissionModule) {
  const permissions = usePermissions()
  return hasModuleAccess(permissions, module)
}

export function usePermissionScope(requiredKey: PermissionKey) {
  const permissions = usePermissions()
  return (
    permissions.find((permission) => permission.key === requiredKey)?.scope ??
    null
  )
}
