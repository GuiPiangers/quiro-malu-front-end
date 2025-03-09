'use server'

import { api } from '../api/api'

export type MessageResponse = {
  id: string
  name: string
  templateMessage: string
  active: boolean
  initialDate?: string
  endDate?: string
}

export type ListMessageResponse = {
  messageCampaigns: MessageResponse[]
  total: number
  limit: number
}

export async function listMessageCampaigns() {
  return await api<ListMessageResponse>('/messageCampaigns')
}
