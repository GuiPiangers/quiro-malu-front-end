'use server'

import { api, type responseError } from '../api/api'
import { Validate } from '../api/Validate'
import type {
  AfterScheduleMessageDTO,
  AfterScheduleMessageResponse,
  ListAfterScheduleMessagesOutput,
} from './afterScheduleMessageTypes'

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

function isListAfterScheduleMessagesOutput(
  value: ListAfterScheduleMessagesOutput | responseError,
): value is ListAfterScheduleMessagesOutput {
  if (Validate.isError(value)) return false
  return (
    typeof value === 'object' && value !== null && Array.isArray(value.items)
  )
}

export async function listAfterScheduleMessages(): Promise<
  ListAfterScheduleMessagesOutput | responseError
> {
  const res = await api<ListAfterScheduleMessagesOutput | responseError>(
    '/afterScheduleMessages',
  )

  if (Validate.isError(res)) {
    return res
  }

  if (!isListAfterScheduleMessagesOutput(res)) {
    return {
      error: true,
      message: 'Resposta inválida da listagem de mensagens após agendamento.',
      statusCode: 500,
      type: 'parse',
    } satisfies responseError
  }

  return res
}

export async function getAfterScheduleMessage(
  id: string,
): Promise<AfterScheduleMessageDTO | responseError> {
  const res = await api<AfterScheduleMessageDTO | responseError>(
    `/afterScheduleMessages/${id}`,
  )
  if (Validate.isError(res)) {
    return res
  }
  return res
}

export async function createAfterScheduleMessage(
  data: AfterScheduleMessageResponse,
): Promise<AfterScheduleMessageDTO | responseError> {
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
  return await api<AfterScheduleMessageDTO | responseError>(
    '/afterScheduleMessages',
    {
      method: 'POST',
      body: JSON.stringify(mapToCreateBody(data, userId)),
    },
  )
}

export async function updateAfterScheduleMessage(
  id: string,
  data: AfterScheduleMessageResponse,
): Promise<AfterScheduleMessageDTO | responseError> {
  return await api<AfterScheduleMessageDTO | responseError>(
    `/afterScheduleMessages/${id}`,
    {
      method: 'PATCH',
      body: JSON.stringify(mapToPatchBody(data)),
    },
  )
}

export async function deleteAfterScheduleMessage(id: string): Promise<unknown> {
  return await api<unknown>(`/afterScheduleMessages/${id}`, {
    method: 'DELETE',
  })
}
