import { ResolvedPermission } from '@/types/permissions'

export type PermissionModule =
  | 'patients'
  | 'patients:read'
  | 'patients:write'
  | 'events'
  | 'events:read'
  | 'events:write'
  | 'services'
  | 'services:read'
  | 'services:write'
  | 'finance'
  | 'finance:read'
  | 'finance:write'
  | 'messages'
  | 'messages:read'
  | 'messages:write'
  | 'message_logs:read'
  | 'message_logs:write'
  | 'users'
  | 'users:read'
  | 'users:write'

export function hasModuleAccess(
  permissions: ResolvedPermission[],
  module: PermissionModule,
): boolean {
  return permissions.some(
    (permission) =>
      permission.key === `${module}` ||
      permission.key === `${module}:read` ||
      permission.key === `${module}:write`,
  )
}
