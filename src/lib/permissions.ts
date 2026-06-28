import { PermissionKey, ResolvedPermission } from '@/types/permissions'

type ExtractModule<T extends string> = T extends `${infer Module}:${string}`
  ? Module
  : never

export type PermissionModule = PermissionKey | ExtractModule<PermissionKey>

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
