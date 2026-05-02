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

async function fetchListMessageSendStrategiesPage(params?: {
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

/** Listagem bruta da API (inclui estratégias de sistema como `unique_send_by_patient`). */
export async function listMessageSendOptions(params?: {
  page?: number
  limit?: number
}): Promise<ListMessageSendStrategyOutput | responseError> {
  return fetchListMessageSendStrategiesPage(params)
}

/** Listagem para formulários e telas de gestão: omite `unique_send_by_patient` (não editável pelo cliente). */
export async function listMessageSendStrategies(params?: {
  page?: number
  limit?: number
}): Promise<ListMessageSendStrategyOutput | responseError> {
  const res = await fetchListMessageSendStrategiesPage(params)
  if (Validate.isError(res)) {
    return res
  }
  const items = res.items.filter((row) => row.kind !== 'unique_send_by_patient')
  const dropped = res.items.length - items.length
  return {
    ...res,
    items,
    total: Math.max(0, res.total - dropped),
  }
}

export async function createMessageSendStrategy(
  data: CreateMessageSendStrategyDTO,
): Promise<ListedMessageSendStrategyDTO | responseError> {
  const body: CreateMessageSendStrategyDTO = {
    ...data,
    name: data.name.trim(),
  }

  return await api<ListedMessageSendStrategyDTO | responseError>(
    '/messageSendStrategies',
    {
      method: 'POST',
      body: JSON.stringify(body),
    },
  )
}

export async function bindCampaignSendStrategies(
  campaignId: string,
  strategyIds: string[],
): Promise<responseError | { ok: true }> {
  const trimmedCampaignId = campaignId.trim()
  if (!trimmedCampaignId) {
    return {
      error: true,
      message: 'Identificador da campanha inválido.',
      statusCode: 400,
      type: 'validation',
    } satisfies responseError
  }

  const normalizedStrategyIds = Array.from(
    new Set(strategyIds.map((id) => id.trim()).filter((id) => id.length > 0)),
  )

  const res = await api<responseError | Record<string, unknown>>(
    `/messageSendStrategies/campaigns/${encodeURIComponent(trimmedCampaignId)}`,
    {
      method: 'PUT',
      cache: 'no-store',
      body: JSON.stringify({ strategyIds: normalizedStrategyIds }),
    },
  )

  if (Validate.isError(res)) {
    return res
  }

  return { ok: true }
}

export async function unbindSendListCampaign(
  campaignId: string,
): Promise<responseError | { ok: true }> {
  const trimmed = campaignId.trim()
  if (!trimmed) {
    return {
      error: true,
      message: 'Identificador da campanha inválido.',
      statusCode: 400,
      type: 'validation',
    } satisfies responseError
  }

  const res = await api<responseError | undefined>(
    `/messageSendStrategies/campaigns/${encodeURIComponent(trimmed)}`,
    {
      method: 'DELETE',
      cache: 'no-store',
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

function isListedStrategyRow(
  row: unknown,
): row is ListedMessageSendStrategyDTO {
  return isListedMessageSendStrategyDTO(
    row as ListedMessageSendStrategyDTO | responseError,
  )
}

function parseStrategiesByCampaignResponse(
  res: unknown,
): ListedMessageSendStrategyDTO[] | null {
  if (Array.isArray(res)) {
    const items = res.filter(isListedStrategyRow)
    return items.length === res.length ? items : null
  }
  if (
    typeof res === 'object' &&
    res !== null &&
    Array.isArray((res as { items?: unknown }).items)
  ) {
    const raw = (res as { items: unknown[] }).items
    const items = raw.filter(isListedStrategyRow)
    return items.length === raw.length ? items : null
  }
  if (
    typeof res === 'object' &&
    res !== null &&
    Array.isArray((res as { strategies?: unknown }).strategies)
  ) {
    const raw = (res as { strategies: unknown[] }).strategies
    const items = raw.filter(isListedStrategyRow)
    return items.length === raw.length ? items : null
  }
  if (isListedMessageSendStrategyDTO(res as ListedMessageSendStrategyDTO)) {
    return [res as ListedMessageSendStrategyDTO]
  }
  return null
}

export async function getMessageSendStrategiesByCampaignId(
  campaignId: string,
): Promise<ListedMessageSendStrategyDTO[] | responseError> {
  const trimmed = campaignId.trim()
  if (!trimmed) {
    return {
      error: true,
      message: 'Identificador da campanha inválido.',
      statusCode: 400,
      type: 'validation',
    } satisfies responseError
  }

  const res = await api<unknown | responseError>(
    `/messageSendStrategies/by-campaign/${encodeURIComponent(trimmed)}`,
    {
      method: 'GET',
      cache: 'no-store',
    },
  )

  if (Validate.isError(res)) {
    return res
  }

  const parsed = parseStrategiesByCampaignResponse(res)
  if (parsed === null) {
    return {
      error: true,
      message: 'Resposta inválida das listas de envio vinculadas à campanha.',
      statusCode: 500,
      type: 'parse',
    } satisfies responseError
  }

  return parsed
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
    ...data,
    name: data.name.trim(),
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

export async function deleteMessageSendStrategy(
  id: string,
): Promise<responseError | { ok: true }> {
  const trimmed = id.trim()
  if (!trimmed) {
    return {
      error: true,
      message: 'Identificador da lista de envio inválido.',
      statusCode: 400,
      type: 'validation',
    } satisfies responseError
  }

  const res = await api<responseError | undefined>(
    `/messageSendStrategies/${encodeURIComponent(trimmed)}`,
    {
      method: 'DELETE',
      cache: 'no-store',
    },
  )

  if (Validate.isError(res)) {
    return res
  }

  return { ok: true }
}
