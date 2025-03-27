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
  console.log('message camapaign está sendo criada')
  console.log('message camapaign data', data)
  return await api('/messageCampaigns', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}
