import type {
  AfterScheduleMessageDTO,
  AfterScheduleMessageResponse,
} from './afterScheduleMessageTypes'

function fallbackNameFromMinutes(minutes: number): string {
  if (minutes >= 1440) {
    return `Mensagem ${Math.floor(minutes / 1440)} dia(s) após`
  }
  if (minutes >= 60) {
    return `Mensagem ${Math.floor(minutes / 60)} hora(s) após`
  }
  return `Mensagem ${minutes} minuto(s) após o agendamento`
}

export function mapAfterScheduleDtoToResponse(
  dto: AfterScheduleMessageDTO,
): AfterScheduleMessageResponse {
  const minutes = dto.minutesAfterSchedule ?? 0
  const fromApi =
    typeof dto.name === 'string' && dto.name.trim() !== ''
      ? dto.name.trim()
      : null

  return {
    id: dto.id,
    name: fromApi ?? fallbackNameFromMinutes(minutes),
    templateMessage: dto.messageTemplate.textTemplate,
    active: dto.isActive,
    minutesAfterSchedule: dto.minutesAfterSchedule,
  }
}
