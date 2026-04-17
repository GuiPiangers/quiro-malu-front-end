'use server'

import { api, type responseError } from '../api/api'
import { Validate } from '../api/Validate'

export type AfterScheduleMessageResponse = {
  id?: string
  name: string
  templateMessage: string
  active: boolean
  delay?: number
  delayUnit?: 'minutes' | 'hours' | 'days'
  minutesAfterSchedule?: number
}

export type ListAfterScheduleMessagesResponse = {
  afterScheduleMessages: AfterScheduleMessageResponse[]
  total: number
  limit: number
}

type ProfileDTO = {
  id?: string
  userId?: string
}

async function resolveUserId(): Promise<string | undefined> {
  const res = await api<ProfileDTO>('/profile', {
    method: 'GET',
    cache: 'no-store',
  })
  if (!Validate.isOk(res)) return undefined
  return res.id ?? res.userId
}

function mapToCreateBody(data: AfterScheduleMessageResponse, userId: string) {
  return {
    userId,
    name: data.name,
    minutesAfterSchedule: data.minutesAfterSchedule ?? 60,
    isActive: data.active,
    messageTemplate: {
      textTemplate: data.templateMessage,
    },
  }
}

function mapToPatchBody(data: AfterScheduleMessageResponse) {
  const body: {
    name?: string
    minutesAfterSchedule?: number
    isActive?: boolean
    messageTemplate?: { textTemplate: string }
  } = {}
  if (data.name !== undefined) body.name = data.name
  if (data.minutesAfterSchedule !== undefined) {
    body.minutesAfterSchedule = data.minutesAfterSchedule
  }
  if (data.active !== undefined) body.isActive = data.active
  if (data.templateMessage !== undefined) {
    body.messageTemplate = { textTemplate: data.templateMessage }
  }
  return body
}

function fallbackNameFromMinutes(minutes: number): string {
  if (minutes >= 1440) {
    return `Mensagem ${Math.floor(minutes / 1440)} dia(s) após`
  }
  if (minutes >= 60) {
    return `Mensagem ${Math.floor(minutes / 60)} hora(s) após`
  }
  return `Mensagem ${minutes} minuto(s) após o agendamento`
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapToFrontendResponse(dto: any): AfterScheduleMessageResponse {
  const minutes = dto.minutesAfterSchedule ?? 0
  const fromApi =
    typeof dto.name === 'string' && dto.name.trim() !== ''
      ? dto.name.trim()
      : null

  return {
    id: dto.id,
    name: fromApi ?? fallbackNameFromMinutes(minutes),
    templateMessage: dto.messageTemplate?.textTemplate ?? '',
    active: dto.isActive ?? true,
    minutesAfterSchedule: dto.minutesAfterSchedule,
  }
}

export async function listAfterScheduleMessages() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const res = await api<any[]>('/afterScheduleMessages')
  if (Validate.isOk(res) && Array.isArray(res)) {
    return {
      afterScheduleMessages: res.map(mapToFrontendResponse),
      total: res.length,
      limit: 100,
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return res as any
}

export async function getAfterScheduleMessage(id: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const res = await api<any>(`/afterScheduleMessages/${id}`)
  if (Validate.isOk(res) && !res.error) {
    return mapToFrontendResponse(res)
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return res as any
}

export async function createAfterScheduleMessage(
  data: AfterScheduleMessageResponse,
) {
  const userId = await resolveUserId()
  if (!userId) {
    return {
      error: true,
      message:
        'Não foi possível identificar o usuário. Verifique se o perfil retorna id.',
      statusCode: 401,
      type: 'auth',
    } satisfies responseError
  }
  return await api('/afterScheduleMessages', {
    method: 'POST',
    body: JSON.stringify(mapToCreateBody(data, userId)),
  })
}

export async function updateAfterScheduleMessage(
  id: string,
  data: AfterScheduleMessageResponse,
) {
  return await api(`/afterScheduleMessages/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(mapToPatchBody(data)),
  })
}

export async function deleteAfterScheduleMessage(id: string) {
  return await api(`/afterScheduleMessages/${id}`, {
    method: 'DELETE',
  })
}
