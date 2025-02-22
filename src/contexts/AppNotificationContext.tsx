'use client'

import useNotificationSSE from '@/hooks/sse/useNotificationSSE'
import { NotificationDTO } from '@/services/notification/notification'
import { ReactNode, createContext } from 'react'

type AppNotificationContextType = {
  notification?: NotificationDTO
  totalNotRead?: number
}

export const AppNotificationContext = createContext(
  {} as AppNotificationContextType,
)

export function AppNotificationContextProvider({
  children,
}: {
  children: ReactNode
}) {
  const { notification, totalNotRead } = useNotificationSSE()

  return (
    <AppNotificationContext.Provider value={{ notification, totalNotRead }}>
      {children}
    </AppNotificationContext.Provider>
  )
}
