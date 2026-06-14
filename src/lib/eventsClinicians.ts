import { ClinicianListItem, listClinicians } from '@/services/user/user'
import { Validate } from '@/services/api/Validate'
import { PermissionScope, ResolvedPermission } from '@/types/permissions'

export function getEventsReadScope(
  permissions: ResolvedPermission[],
): PermissionScope | null {
  return (
    permissions.find((permission) => permission.key === 'events:read')?.scope ??
    null
  )
}

export function isOwnEventsScope(
  scope: PermissionScope | null | undefined,
): boolean {
  return scope?.type === 'own'
}

export function resolveSelectedEventUserId(
  clinicians: ClinicianListItem[],
  sessionUserId: string | undefined,
  queryUserId?: string,
): string | undefined {
  if (
    queryUserId &&
    clinicians.some((clinician) => clinician.id === queryUserId)
  ) {
    return queryUserId
  }

  return clinicians[0]?.id ?? sessionUserId
}

export async function listEventClinicians(): Promise<ClinicianListItem[]> {
  const result = await listClinicians()
  return Validate.isOk(result) ? result : []
}
