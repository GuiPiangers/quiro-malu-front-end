'use client'

import { usePermissions } from '@/contexts/PermissionsContext'
import { PermissionKey } from '@/types/permissions'

export function useAccess(requiredKey: PermissionKey) {
  const permissions = usePermissions()
  return permissions.some((permission) => permission.key === requiredKey)
}

export function usePermissionScope(requiredKey: PermissionKey) {
  const permissions = usePermissions()
  return (
    permissions.find((permission) => permission.key === requiredKey)?.scope ??
    null
  )
}
