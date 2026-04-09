'use server'

import { api } from '../api/api'

export type WhatsAppConnectionStatus =
  | 'NOT_REGISTERED'
  | 'CONNECTED'
  | 'CONNECTING'
  | 'DISCONNECTED'

export type WhatsAppRegisterResponse = {
  instanceName: string
  qrCode: string | null
}

export type WhatsAppStatusResponse = {
  status: WhatsAppConnectionStatus
}

export async function registerWhatsApp() {
  return await api<WhatsAppRegisterResponse>('/whatsapp/register', {
    method: 'POST',
  })
}

export async function getWhatsAppStatus() {
  return await api<WhatsAppStatusResponse>('/whatsapp/status')
}
