'use client'

import { usePermissions } from '@/contexts/PermissionsContext'
import { PermissionKey } from '@/types/permissions'

export type PermissionModule =
  | 'patients'
  | 'events'
  | 'services'
  | 'finance'
  | 'messages'

export function useAccess(requiredKey: PermissionKey) {
  const permissions = usePermissions()
  return permissions.some((permission) => permission.key === requiredKey)
}

export function useModuleAccess(module: PermissionModule) {
  const permissions = usePermissions()
  return permissions.some(
    (permission) =>
      permission.key === `${module}:read` ||
      permission.key === `${module}:write`,
  )
}

export function usePermissionScope(requiredKey: PermissionKey) {
  const permissions = usePermissions()
  return (
    permissions.find((permission) => permission.key === requiredKey)?.scope ??
    null
  )
}
