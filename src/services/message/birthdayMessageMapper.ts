import { DEFAULT_BIRTHDAY_SEND_TIME } from './birthdayMessageConstants'
import type {
  BirthdayMessageDTO,
  BirthdayMessageResponse,
} from './birthdayMessageTypes'

export function normalizeSendTimeString(sendTime: string): string {
  const parts = sendTime.trim().split(':')
  if (parts.length >= 2) {
    const h = parseInt(parts[0], 10)
    const m = parseInt(parts[1], 10)
    if (!Number.isNaN(h) && !Number.isNaN(m)) {
      const hh = String(Math.min(23, Math.max(0, h))).padStart(2, '0')
      const mm = String(Math.min(59, Math.max(0, m))).padStart(2, '0')
      return `${hh}:${mm}`
    }
  }
  return DEFAULT_BIRTHDAY_SEND_TIME
}

export function mapBirthdayDtoToResponse(
  dto: BirthdayMessageDTO,
): BirthdayMessageResponse {
  return {
    id: dto.id,
    name: dto.name.trim(),
    templateMessage: dto.messageTemplate.textTemplate,
    active: dto.isActive,
    sendTime: normalizeSendTimeString(dto.sendTime),
  }
}
