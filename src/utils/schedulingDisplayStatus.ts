import type { SchedulingStatus } from '@/services/scheduling/scheduling'

export function isSchedulingStartInPast(dateIso: string): boolean {
  return new Date().toISOString() > new Date(dateIso).toISOString()
}

export function getDisplaySchedulingStatus(
  status: SchedulingStatus,
  dateIso: string,
): SchedulingStatus {
  if (status === 'Agendado' && isSchedulingStartInPast(dateIso)) {
    return 'Atrasado'
  }
  return status
}
