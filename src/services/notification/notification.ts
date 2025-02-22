'use server'

import { api } from '../api/api'

export type NotificationDTO = {
  message: string
  read: boolean
  title: string
  type: string
}

export async function subscribeNotification(subscription: string) {
  const res = await api('/subscribe', {
    method: 'POST',
    body: subscription,
    headers: { 'Content-Type': 'application/json' },
  })

  return res
}
