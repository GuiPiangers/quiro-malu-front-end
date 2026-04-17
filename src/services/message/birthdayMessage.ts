'use server'

import { api } from '../api/api'
import { Validate } from '../api/Validate'

/** Item retornado pelo GET `/birthdayMessages` (antes do mapeamento para o form). */
export type BirthdayMessageDTO = {
  id?: string
  name: string
  isActive?: boolean
  sendTime?: string | number
  messageTemplate?: { textTemplate?: string }
}

export type BirthdayMessageResponse = {
  id?: string
  name: string
  templateMessage: string
  active: boolean
  /** HH:mm (ex.: 09:00) */
  sendTime?: string
}

export type ListBirthdayMessagesResponse = {
  items: BirthdayMessageResponse[]
  total: number
  page: number
  limit: number
}

const DEFAULT_SEND_TIME = '09:00'

function sendTimeToMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map((x) => parseInt(x, 10))
  if (Number.isNaN(h) || Number.isNaN(m)) return 9 * 60
  return (h % 24) * 60 + (m % 60)
}

function minutesToSendTime(total: number): string {
  const t = ((total % (24 * 60)) + 24 * 60) % (24 * 60)
  const h = Math.floor(t / 60)
  const m = t % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

function normalizeSendTimeFromDto(dto: unknown): string {
  if (dto == null || typeof dto !== 'object') return DEFAULT_SEND_TIME
  const v = (dto as { sendTime?: unknown }).sendTime
  if (typeof v === 'string' && /\d{1,2}:\d{2}/.test(v)) {
    const raw = v.trim().slice(0, 8)
    const [hs, ms] = raw.split(':')
    const hh = String(
      Math.min(23, Math.max(0, parseInt(hs, 10) || 0)),
    ).padStart(2, '0')
    const mm = String(
      Math.min(59, Math.max(0, parseInt(ms ?? '0', 10) || 0)),
    ).padStart(2, '0')
    return `${hh}:${mm}`
  }
  if (typeof v === 'number' && Number.isFinite(v)) {
    return minutesToSendTime(Math.round(v))
  }
  return DEFAULT_SEND_TIME
}

function mapToCreateBody(data: BirthdayMessageResponse) {
  return {
    name: data.name,
    isActive: data.active,
    sendTime: data.sendTime ?? DEFAULT_SEND_TIME,
    messageTemplate: {
      textTemplate: data.templateMessage,
    },
  }
}

function mapToPatchBody(data: BirthdayMessageResponse) {
  const body: {
    name?: string
    sendTime?: number
    isActive?: boolean
    messageTemplate?: { textTemplate: string }
  } = {}
  if (data.name !== undefined) body.name = data.name
  if (data.sendTime !== undefined) {
    body.sendTime = sendTimeToMinutes(data.sendTime)
  }
  if (data.active !== undefined) body.isActive = data.active
  if (data.templateMessage !== undefined) {
    body.messageTemplate = { textTemplate: data.templateMessage }
  }
  return body
}

function mapToFrontendResponse(
  dto: BirthdayMessageDTO,
): BirthdayMessageResponse {
  return {
    id: dto.id,
    name: typeof dto.name === 'string' ? dto.name.trim() : '',
    templateMessage: dto.messageTemplate?.textTemplate ?? '',
    active: dto.isActive ?? true,
    sendTime: normalizeSendTimeFromDto(dto),
  }
}

type BirthdayMessagesListApi = {
  items: BirthdayMessageDTO[]
  total: number
  page: number
  limit: number
}

export async function listBirthdayMessages() {
  const res = await api<BirthdayMessagesListApi>('/birthdayMessages')
  if (
    Validate.isOk(res) &&
    res &&
    typeof res === 'object' &&
    Array.isArray(res.items)
  ) {
    return {
      items: res.items.map(mapToFrontendResponse),
      total: res.total ?? 0,
      page: res.page ?? 1,
      limit: res.limit ?? res.items.length,
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return res as any
}

export async function getBirthdayMessage(id: string) {
  const res = await api<BirthdayMessageDTO>(`/birthdayMessages/${id}`)
  if (Validate.isOk(res)) {
    return mapToFrontendResponse(res)
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return res as any
}

export async function createBirthdayMessage(data: BirthdayMessageResponse) {
  return await api('/birthdayMessages', {
    method: 'POST',
    body: JSON.stringify(mapToCreateBody(data)),
  })
}

export async function updateBirthdayMessage(
  id: string,
  data: BirthdayMessageResponse,
) {
  return await api(`/birthdayMessages/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(mapToPatchBody(data)),
  })
}

export async function deleteBirthdayMessage(id: string) {
  return await api(`/birthdayMessages/${id}`, {
    method: 'DELETE',
  })
}
