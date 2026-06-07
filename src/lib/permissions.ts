import { ResolvedPermission } from '@/types/permissions'

export type PermissionModule =
  | 'patients'
  | 'events'
  | 'services'
  | 'finance'
  | 'messages'

export function hasModuleAccess(
  permissions: ResolvedPermission[],
  module: PermissionModule,
): boolean {
  return permissions.some(
    (permission) =>
      permission.key === `${module}:read` ||
      permission.key === `${module}:write`,
  )
}
