'use server'

import { api } from '../api/api'

export type NotificationDTO<T = undefined> = {
  id: string
  message: string
  read: boolean
  title: string
  type: string
  actionNeeded?: boolean
  params?: T
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

export async function setReadNotifications(data: { id: string }[]) {
  return await api<NotificationDTO[]>('/notifications/setRead', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function setActionDoneNotification(data: { id: string }) {
  return await api<NotificationDTO[]>('/notifications/setActionDone', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}
