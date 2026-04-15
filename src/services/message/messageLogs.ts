'use server'

import { api } from '../api/api'

export type WhatsAppMessageLogStatus =
  | 'PENDING'
  | 'SENT'
  | 'DELIVERED'
  | 'READ'
  | 'FAILED'

export type WhatsAppMessageLogDTO = {
  id: string
  userId: string
  patientId: string
  schedulingId: string
  beforeScheduleMessageId: string
  message: string
  toPhone: string
  instanceName: string
  status: WhatsAppMessageLogStatus
  providerMessageId: string | null
  errorMessage: string | null
  sentAt: string | null
  deliveredAt: string | null
  readAt: string | null
  createdAt: string
  updatedAt: string
}

export type ListWhatsAppMessageLogsResult = {
  items: WhatsAppMessageLogDTO[]
  total: number
}

export type ListWhatsAppMessageLogsOutput = ListWhatsAppMessageLogsResult & {
  page: number
  limit: number
}

export type GetMessageLogsParams = {
  page?: number
  limit?: number
  patientId?: string
  beforeScheduleMessageId?: string
  status?: WhatsAppMessageLogStatus
}

export async function getMessageLogs(params: GetMessageLogsParams = {}) {
  const sp = new URLSearchParams()
  if (params.page != null) sp.set('page', String(params.page))
  if (params.limit != null) sp.set('limit', String(params.limit))
  if (params.patientId) sp.set('patientId', params.patientId)
  if (params.beforeScheduleMessageId)
    sp.set('beforeScheduleMessageId', params.beforeScheduleMessageId)
  if (params.status) sp.set('status', params.status)

  const qs = sp.toString()
  const path = qs ? `/messages/logs?${qs}` : '/messages/logs'
  return await api<ListWhatsAppMessageLogsOutput>(path)
}
