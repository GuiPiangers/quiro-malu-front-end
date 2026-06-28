export const PERMISSION_KEYS = [
  'patients:read',
  'patients:write',
  'patients_clinical_data:read',
  'patients_clinical_data:write',
  'events:read',
  'events:write',
  'services:read',
  'services:write',
  'finance:read',
  'finance:write',
  'messages:read',
  'messages:write',
  'message_logs:read',
  'message_logs:write',
  'users:read',
  'users:write',
] as const

export type PermissionKey = (typeof PERMISSION_KEYS)[number]

export type PermissionScope =
  | { type: 'all' }
  | { type: 'own' }
  | { type: 'list'; userIds: string[] }

export type ResolvedPermission = {
  key: PermissionKey
  scope: PermissionScope | null
}
