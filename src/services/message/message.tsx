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

export async function listMessageCampaigns() {
  return await api<MessageResponse[]>('/messageCampaigns')
}
