'use server'

import { api, type responseError } from '../api/api'
import { Validate } from '../api/Validate'
import { DEFAULT_BIRTHDAY_SEND_TIME } from './birthdayMessageConstants'
import type {
  BirthdayMessageDTO,
  BirthdayMessageResponse,
  ListBirthdayMessagesDTO,
  ListBirthdayMessagesOutput,
} from './birthdayMessageTypes'

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

function sendTimeToMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map((x) => parseInt(x, 10))
  if (Number.isNaN(h) || Number.isNaN(m)) return 9 * 60
  return (h % 24) * 60 + (m % 60)
}

function mapToCreateBody(data: BirthdayMessageResponse) {
  return {
    name: data.name,
    isActive: data.active,
    sendTime: data.sendTime ?? DEFAULT_BIRTHDAY_SEND_TIME,
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

function isListBirthdayMessagesOutput(
  value: ListBirthdayMessagesOutput | responseError,
): value is ListBirthdayMessagesOutput {
  if (Validate.isError(value)) return false
  return (
    typeof value === 'object' && value !== null && Array.isArray(value.items)
  )
}

export async function listBirthdayMessages(
  params?: Partial<ListBirthdayMessagesDTO>,
): Promise<ListBirthdayMessagesOutput | responseError> {
  const userId = params?.userId ?? (await resolveUserId())
  if (!userId) {
    return {
      error: true,
      message:
        'Não foi possível identificar o usuário. Verifique se o perfil retorna id.',
      statusCode: 401,
      type: 'auth',
    } satisfies responseError
  }

  const sp = new URLSearchParams()
  sp.set('userId', userId)
  if (params?.page != null) sp.set('page', String(params.page))
  if (params?.limit != null) sp.set('limit', String(params.limit))

  const res = await api<ListBirthdayMessagesOutput | responseError>(
    `/birthdayMessages?${sp.toString()}`,
  )

  if (Validate.isError(res)) {
    return res
  }

  if (!isListBirthdayMessagesOutput(res)) {
    return {
      error: true,
      message: 'Resposta inválida da listagem de aniversários.',
      statusCode: 500,
      type: 'parse',
    } satisfies responseError
  }

  return res
}

export async function getBirthdayMessage(
  id: string,
): Promise<BirthdayMessageDTO | responseError> {
  const res = await api<BirthdayMessageDTO | responseError>(
    `/birthdayMessages/${id}`,
  )
  if (Validate.isError(res)) {
    return res
  }
  return res
}

export async function createBirthdayMessage(
  data: BirthdayMessageResponse,
): Promise<BirthdayMessageDTO | responseError> {
  return await api<BirthdayMessageDTO | responseError>('/birthdayMessages', {
    method: 'POST',
    body: JSON.stringify(mapToCreateBody(data)),
  })
}

export async function updateBirthdayMessage(
  id: string,
  data: BirthdayMessageResponse,
): Promise<BirthdayMessageDTO | responseError> {
  return await api<BirthdayMessageDTO | responseError>(
    `/birthdayMessages/${id}`,
    {
      method: 'PATCH',
      body: JSON.stringify(mapToPatchBody(data)),
    },
  )
}

export async function deleteBirthdayMessage(id: string): Promise<unknown> {
  return await api<unknown>(`/birthdayMessages/${id}`, {
    method: 'DELETE',
  })
}
