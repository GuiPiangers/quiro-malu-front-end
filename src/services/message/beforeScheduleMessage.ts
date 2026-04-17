'use server'

import { api, type responseError } from '../api/api'
import { Validate } from '../api/Validate'
import type {
  BeforeScheduleMessageDTO,
  BeforeScheduleMessageResponse,
  ListBeforeScheduleMessagesOutput,
} from './beforeScheduleMessageTypes'

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

function mapToBackendDTO(data: BeforeScheduleMessageResponse) {
  return {
    id: data.id,
    name: data.name,
    minutesBeforeSchedule: data.minutesBeforeSchedule ?? 1440,
    isActive: data.active,
    messageTemplate: {
      textTemplate: data.templateMessage,
    },
  }
}

function isListBeforeScheduleMessagesOutput(
  value: ListBeforeScheduleMessagesOutput | responseError,
): value is ListBeforeScheduleMessagesOutput {
  if (Validate.isError(value)) return false
  return (
    typeof value === 'object' && value !== null && Array.isArray(value.items)
  )
}

export async function listBeforeScheduleMessages(): Promise<
  ListBeforeScheduleMessagesOutput | responseError
> {
  const res = await api<ListBeforeScheduleMessagesOutput | responseError>(
    '/beforeScheduleMessages',
  )

  if (Validate.isError(res)) {
    return res
  }

  if (!isListBeforeScheduleMessagesOutput(res)) {
    return {
      error: true,
      message:
        'Resposta inválida da listagem de mensagens antes de agendamento.',
      statusCode: 500,
      type: 'parse',
    } satisfies responseError
  }

  return res
}

export async function getBeforeScheduleMessage(
  id: string,
): Promise<BeforeScheduleMessageDTO | responseError> {
  const res = await api<BeforeScheduleMessageDTO | responseError>(
    `/beforeScheduleMessages/${id}`,
  )
  if (Validate.isError(res)) {
    return res
  }
  return res
}

export async function createBeforeScheduleMessage(
  data: BeforeScheduleMessageResponse,
): Promise<BeforeScheduleMessageDTO | responseError> {
  return await api<BeforeScheduleMessageDTO | responseError>(
    '/beforeScheduleMessages',
    {
      method: 'POST',
      body: JSON.stringify(mapToBackendDTO(data)),
    },
  )
}

export async function updateBeforeScheduleMessage(
  id: string,
  data: BeforeScheduleMessageResponse,
): Promise<BeforeScheduleMessageDTO | responseError> {
  return await api<BeforeScheduleMessageDTO | responseError>(
    `/beforeScheduleMessages/${id}`,
    {
      method: 'PATCH',
      body: JSON.stringify(mapToBackendDTO(data)),
    },
  )
}

export async function deleteBeforeScheduleMessage(
  id: string,
): Promise<unknown> {
  return await api<unknown>(`/beforeScheduleMessages/${id}`, {
    method: 'DELETE',
  })
}
