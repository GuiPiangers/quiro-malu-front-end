'use server'

import { api } from '../api/api'

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
  /** Delay in minutes before the schedule. Negative values mean "before". */
  delay?: number
  delayUnit?: 'minutes' | 'hours' | 'days'
}

export type ListBeforeScheduleMessagesResponse = {
  beforeScheduleMessages: BeforeScheduleMessageResponse[]
  total: number
  limit: number
}

export async function listBeforeScheduleMessages() {
  return await api<ListBeforeScheduleMessagesResponse>(
    '/beforeScheduleMessages',
  )
}

export async function getBeforeScheduleMessage(id: string) {
  return await api<BeforeScheduleMessageResponse>(
    `/beforeScheduleMessages/${id}`,
  )
}

export async function createBeforeScheduleMessage(
  data: BeforeScheduleMessageResponse,
) {
  return await api('/beforeScheduleMessages', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function updateBeforeScheduleMessage(
  id: string,
  data: BeforeScheduleMessageResponse,
) {
  return await api(`/beforeScheduleMessages/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}
