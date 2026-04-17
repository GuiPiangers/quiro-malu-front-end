import type {
  BeforeScheduleMessageDTO,
  BeforeScheduleMessageResponse,
} from './beforeScheduleMessageTypes'

function fallbackNameFromMinutes(minutes: number): string {
  if (minutes >= 1440) {
    return `Lembrete ${Math.floor(minutes / 1440)} dia(s) antes`
  }
  if (minutes >= 60) {
    return `Lembrete ${Math.floor(minutes / 60)} hora(s) antes`
  }
  return `Lembrete ${minutes} minuto(s) antes`
}

export function mapBeforeScheduleDtoToResponse(
  dto: BeforeScheduleMessageDTO,
): BeforeScheduleMessageResponse {
  const minutes = dto.minutesBeforeSchedule || 0
  const fromApi =
    typeof dto.name === 'string' && dto.name.trim() !== ''
      ? dto.name.trim()
      : null

  return {
    id: dto.id,
    name: fromApi ?? fallbackNameFromMinutes(minutes),
    templateMessage: dto.messageTemplate.textTemplate,
    active: dto.isActive,
    minutesBeforeSchedule: dto.minutesBeforeSchedule,
  }
}
