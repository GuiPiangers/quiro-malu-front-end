'use server'

import { api, type responseError } from '../api/api'
import { Validate } from '../api/Validate'
import type {
  CreateMessageSendStrategyDTO,
  ListedMessageSendStrategyDTO,
  ListMessageSendStrategyOutput,
  PatchMessageSendStrategyDTO,
} from './sendListTypes'
import { isListedMessageSendStrategyDTO } from './sendListGuards'

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
  const body: CreateMessageSendStrategyDTO = {
    kind: data.kind,
    name: data.name.trim(),
    params: { amount: data.amount },
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

export async function getMessageSendStrategy(
  id: string,
): Promise<ListedMessageSendStrategyDTO | responseError> {
  const trimmed = id.trim()
  if (!trimmed) {
    return {
      error: true,
      message: 'Identificador da lista de envio inválido.',
      statusCode: 400,
      type: 'validation',
    } satisfies responseError
  }

  const res = await api<ListedMessageSendStrategyDTO | responseError>(
    `/messageSendStrategies/${encodeURIComponent(trimmed)}`,
    {
      method: 'GET',
      cache: 'no-store',
    },
  )

  if (Validate.isError(res)) {
    return res
  }

  if (!isListedMessageSendStrategyDTO(res)) {
    return {
      error: true,
      message: 'Resposta inválida da lista de envio.',
      statusCode: 500,
      type: 'parse',
    } satisfies responseError
  }

  return res
}

export async function getMessageSendStrategyByCampaignId(
  campaignId: string,
): Promise<ListedMessageSendStrategyDTO | responseError> {
  const trimmed = campaignId.trim()
  if (!trimmed) {
    return {
      error: true,
      message: 'Identificador da campanha inválido.',
      statusCode: 400,
      type: 'validation',
    } satisfies responseError
  }

  const res = await api<ListedMessageSendStrategyDTO | responseError>(
    `/messageSendStrategies/by-campaign/${encodeURIComponent(trimmed)}`,
    {
      method: 'GET',
      cache: 'no-store',
    },
  )

  if (Validate.isError(res)) {
    return res
  }

  if (!isListedMessageSendStrategyDTO(res)) {
    return {
      error: true,
      message: 'Resposta inválida da lista de envio vinculada à campanha.',
      statusCode: 500,
      type: 'parse',
    } satisfies responseError
  }

  return res
}

export async function updateMessageSendStrategy(
  id: string,
  data: PatchMessageSendStrategyDTO,
): Promise<ListedMessageSendStrategyDTO | responseError> {
  const trimmed = id.trim()
  if (!trimmed) {
    return {
      error: true,
      message: 'Identificador da lista de envio inválido.',
      statusCode: 400,
      type: 'validation',
    } satisfies responseError
  }

  const body: PatchMessageSendStrategyDTO = {
    kind: data.kind,
    name: data.name.trim(),
    params: { amount: data.params.amount },
  }

  return await api<ListedMessageSendStrategyDTO | responseError>(
    `/messageSendStrategies/${encodeURIComponent(trimmed)}`,
    {
      method: 'PATCH',
      cache: 'no-store',
      body: JSON.stringify(body),
    },
  )
}
