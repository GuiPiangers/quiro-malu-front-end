'use server'

import { api } from '../api/api'

export type NotificationDTO = {
  id: string
  message: string
  read: boolean
  title: string
  type: string
  actionNeeded?: boolean
}

export async function subscribeNotification(subscription: string) {
  const res = await api('/subscribe', {
    method: 'POST',
    body: subscription,
    headers: { 'Content-Type': 'application/json' },
  })

  return res
}

export async function listNotifications() {
  return await api<NotificationDTO[]>('/notifications')
}
