'use client'

import { useNotifications } from '@/hooks/useWebPush'
import { useEffect } from 'react'

export default function SubscribeNotification() {
  const { subscribeToPush, permission } = useNotifications()

  useEffect(() => {
    subscribeToPush()
  }, [subscribeToPush])

  console.log(permission)

  return undefined
}
