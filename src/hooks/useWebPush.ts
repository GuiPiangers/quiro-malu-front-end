import { subscribeNotification } from '@/services/notification/notification'
import { useEffect, useState } from 'react'

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY

export function useNotifications() {
  const [permission, setPermission] =
    useState<NotificationPermission>('default')

  useEffect(() => {
    try {
      if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission().then(setPermission)
      }
    } catch (error) {
      console.log(error)
    }
  }, [])

  const subscribeToPush = async () => {
    try {
      if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        return
      }

      await navigator.serviceWorker.register('/sw.js')
      const serviceWorkerReady = await navigator.serviceWorker.ready

      const isSubscribed = !!sessionStorage.getItem('web-push-subscribed')

      if (!isSubscribed) {
        const subscription = await serviceWorkerReady.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY!),
        })

        if (subscription) {
          await subscribeNotification(JSON.stringify(subscription))
          sessionStorage.setItem('web-push-subscribed', 'true')
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  return { subscribeToPush, permission }
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}
