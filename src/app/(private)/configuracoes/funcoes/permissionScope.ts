import { PermissionKey, PermissionScope } from '@/types/permissions'

export const SCOPED_PERMISSION_KEYS = new Set<PermissionKey>([
  'events:read',
  'events:write',
])

export type EventsScopeChoice = 'all' | 'own' | 'list'

export function permissionSupportsScope(permissionKey: string): boolean {
  return SCOPED_PERMISSION_KEYS.has(permissionKey as PermissionKey)
}

export function scopeChoiceFromPermission(
  scope: PermissionScope | null | undefined,
): EventsScopeChoice {
  if (!scope || scope.type === 'all') return 'all'
  if (scope.type === 'own') return 'own'
  return 'list'
}

export function permissionScopeFromChoice(
  choice: EventsScopeChoice,
  userIds: string[],
): PermissionScope | null {
  if (choice === 'all') return null
  if (choice === 'own') return { type: 'own' }
  return { type: 'list', userIds }
}

export function listUserIdsFromScope(
  scope: PermissionScope | null | undefined,
): string[] {
  if (scope?.type === 'list') return scope.userIds
  return []
}
