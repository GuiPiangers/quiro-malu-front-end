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

// Helper para mapear requisições do front-end para o DTO do backend
function mapToBackendDTO(data: BeforeScheduleMessageResponse) {
  return {
    id: data.id,
    minutesBeforeSchedule: data.minutesBeforeSchedule ?? 1440, // default 24h
    isActive: data.active,
    messageTemplate: {
      textTemplate: data.templateMessage,
    },
  }
}

// Helper para mapear respostas do backend para o formato do front-end
function mapToFrontendResponse(dto: any): BeforeScheduleMessageResponse {
  // O backend não salva name, então criamos um nome baseado no tempo
  const minutes = dto.minutesBeforeSchedule || 0
  const name =
    minutes >= 1440
      ? `Lembrete ${Math.floor(minutes / 1440)} dia(s) antes`
      : minutes >= 60
      ? `Lembrete ${Math.floor(minutes / 60)} hora(s) antes`
      : `Lembrete ${minutes} minuto(s) antes`

  return {
    id: dto.id,
    name,
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
