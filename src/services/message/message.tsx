'use server'

import { api } from '../api/api'
import { Validate } from '../api/Validate'

export type TriggerDTO<T = unknown> = {
  event: string
  config?: T
}

export type MessageResponse<T = unknown> = {
  id: string
  name: string
  templateMessage: string
  active: boolean
  initialDate?: string
  endDate?: string
  triggers: TriggerDTO<T>[]
}

export type ListMessageResponse = {
  messageCampaigns: MessageResponse[]
  total: number
  limit: number
}

export async function listMessageCampaigns() {
  return await api<ListMessageResponse>('/messageCampaigns')
}

export async function createMessageCampaigns(data: MessageResponse) {
  return await api('/messageCampaigns', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

// ── Before Schedule Message ──────────────────────────────────────

export type BeforeScheduleMessageResponse = {
  id?: string
  name: string
  templateMessage: string
  active: boolean
  delay?: number
  delayUnit?: 'minutes' | 'hours' | 'days'
  minutesBeforeSchedule?: number
}

export type ListBeforeScheduleMessagesResponse = {
  beforeScheduleMessages: BeforeScheduleMessageResponse[]
  total: number
  limit: number
}

// Helper para mapear requisições do front-end para o DTO do backend
function mapToBackendDTO(data: BeforeScheduleMessageResponse) {
  return {
    id: data.id,
    name: data.name,
    minutesBeforeSchedule: data.minutesBeforeSchedule ?? 1440, // default 24h
    isActive: data.active,
    messageTemplate: {
      textTemplate: data.templateMessage,
    },
  }
}

function fallbackNameFromMinutes(minutes: number): string {
  if (minutes >= 1440) {
    return `Lembrete ${Math.floor(minutes / 1440)} dia(s) antes`
  }
  if (minutes >= 60) {
    return `Lembrete ${Math.floor(minutes / 60)} hora(s) antes`
  }
  return `Lembrete ${minutes} minuto(s) antes`
}

// Helper para mapear respostas do backend para o formato do front-end
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapToFrontendResponse(dto: any): BeforeScheduleMessageResponse {
  const minutes = dto.minutesBeforeSchedule || 0
  const fromApi =
    typeof dto.name === 'string' && dto.name.trim() !== ''
      ? dto.name.trim()
      : null

  return {
    id: dto.id,
    name: fromApi ?? fallbackNameFromMinutes(minutes),
    templateMessage: dto.messageTemplate?.textTemplate ?? '',
    active: dto.isActive ?? true,
    minutesBeforeSchedule: dto.minutesBeforeSchedule,
  }
}

export async function listBeforeScheduleMessages() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const res = await api<any[]>('/beforeScheduleMessages')
  if (Validate.isOk(res) && Array.isArray(res)) {
    return {
      beforeScheduleMessages: res.map(mapToFrontendResponse),
      total: res.length,
      limit: 100,
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return res as any
}

export async function getBeforeScheduleMessage(id: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const res = await api<any>(`/beforeScheduleMessages/${id}`)
  if (Validate.isOk(res) && !res.error) {
    return mapToFrontendResponse(res)
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return res as any
}

export async function createBeforeScheduleMessage(
  data: BeforeScheduleMessageResponse,
) {
  return await api('/beforeScheduleMessages', {
    method: 'POST',
    body: JSON.stringify(mapToBackendDTO(data)),
  })
}

export async function updateBeforeScheduleMessage(
  id: string,
  data: BeforeScheduleMessageResponse,
) {
  return await api(`/beforeScheduleMessages/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(mapToBackendDTO(data)),
  })
}

export async function deleteBeforeScheduleMessage(id: string) {
  return await api(`/beforeScheduleMessages/${id}`, {
    method: 'DELETE',
  })
}
