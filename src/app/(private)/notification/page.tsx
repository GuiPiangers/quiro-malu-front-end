'use client'

import { useNotifications } from '@/hooks/useWebPush'
import { useEffect } from 'react'

export default function Notifications() {
  const { subscribeToPush, permission } = useNotifications()

  useEffect(() => {
    subscribeToPush()
  }, [subscribeToPush])

  console.log(permission)

  return (
    <div>
      <h1>Notificações</h1>
    </div>
  )
}
