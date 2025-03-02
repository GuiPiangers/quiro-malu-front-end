'use server'

import { revalidateTag } from 'next/cache'
import { api } from '../api/api'

export type notificationType = 'sendMessage' | 'default' | 'undoExam'

export type NotificationDTO<T = undefined> = {
  id: string
  message: string
  read: boolean
  title: string
  type: notificationType
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
  return await api<NotificationDTO[]>('/notifications', {
    next: { tags: ['newNotification', 'deleteNotification', 'setActionDone'] },
  })
}

export async function deleteManyNotifications(data: {
  notificationsId: string[]
}) {
  revalidateTag('deleteNotification')
  return await api<NotificationDTO[]>('/notifications/deleteMany', {
    method: 'DELETE',
    body: JSON.stringify(data),
  })
}

export async function setReadNotifications(data: { id: string }[]) {
  return await api<NotificationDTO[]>('/notifications/setRead', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function setActionDoneNotification(data: { id: string }) {
  revalidateTag('setActionDone')
  return await api<NotificationDTO[]>('/notifications/setActionDone', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}
