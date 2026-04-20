'use server'

import { api, type responseError } from '../api/api'
import { Validate } from '../api/Validate'
import { listAfterScheduleMessages } from './afterScheduleMessage'
import { listBeforeScheduleMessages } from './beforeScheduleMessage'
import { listBirthdayMessages } from './birthdayMessage'
import type {
  BindableCampaignRow,
  CreateMessageSendStrategyDTO,
  ListedMessageSendStrategyDTO,
  ListMessageSendStrategyOutput,
} from './sendListTypes'

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

function isListMessageSendStrategyOutput(
  value: ListMessageSendStrategyOutput | responseError,
): value is ListMessageSendStrategyOutput {
  if (Validate.isError(value)) return false
  return (
    typeof value === 'object' &&
    value !== null &&
    Array.isArray(value.items) &&
    typeof value.total === 'number' &&
    typeof value.page === 'number' &&
    typeof value.limit === 'number'
  )
}

export async function listMessageSendStrategies(params?: {
  page?: number
  limit?: number
}): Promise<ListMessageSendStrategyOutput | responseError> {
  const search = new URLSearchParams()
  if (params?.page != null) search.set('page', String(params.page))
  if (params?.limit != null) search.set('limit', String(params.limit))
  const qs = search.toString()
  const path = qs ? `/messageSendStrategies?${qs}` : '/messageSendStrategies'

  const res = await api<ListMessageSendStrategyOutput | responseError>(path, {
    method: 'GET',
    cache: 'no-store',
  })

  if (Validate.isError(res)) {
    return res
  }

  if (!isListMessageSendStrategyOutput(res)) {
    return {
      error: true,
      message: 'Resposta inválida da listagem de listas de envio.',
      statusCode: 500,
      type: 'parse',
    } satisfies responseError
  }

  return res
}

export async function createMessageSendStrategy(data: {
  name: string
  amount: number
  kind: string
}): Promise<ListedMessageSendStrategyDTO | responseError> {
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

  const body: CreateMessageSendStrategyDTO = {
    userId,
    name: data.name.trim(),
    amount: data.amount,
    kind: data.kind,
  }

  return await api<ListedMessageSendStrategyDTO | responseError>(
    '/messageSendStrategies',
    {
      method: 'POST',
      body: JSON.stringify(body),
    },
  )
}

export async function bindSendListCampaigns(
  strategyId: string,
  campaignIds: string[],
): Promise<responseError | { ok: true }> {
  const trimmedId = strategyId.trim()
  if (!trimmedId) {
    return {
      error: true,
      message: 'Identificador da lista de envio inválido.',
      statusCode: 400,
      type: 'validation',
    } satisfies responseError
  }

  const res = await api<responseError | Record<string, unknown>>(
    `/messageSendStrategies/${encodeURIComponent(trimmedId)}/campaigns`,
    {
      method: 'PUT',
      cache: 'no-store',
      body: JSON.stringify({ campaignIds }),
    },
  )

  if (Validate.isError(res)) {
    return res
  }

  return { ok: true }
}
