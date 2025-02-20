'use client'

import { useNotifications } from '@/hooks/useWebPush'
import { useEffect } from 'react'

export default function SubscribeNotification() {
  const { subscribeToPush } = useNotifications()

  useEffect(() => {
    subscribeToPush()
  }, [subscribeToPush])

  return undefined
}
