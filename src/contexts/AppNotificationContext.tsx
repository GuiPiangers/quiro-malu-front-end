'use client'

import useNotificationSSE from '@/hooks/sse/useNotificationSSE'
import { NotificationDTO } from '@/services/notification/notification'
import { revalidatePath, revalidateTag } from 'next/cache'
import { usePathname, useRouter } from 'next/navigation'

import { ReactNode, createContext, useEffect } from 'react'

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
  const path = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (path === '/notifications') {
      router.refresh()
    }
  }, [notification, totalNotRead])

  return (
    <AppNotificationContext.Provider value={{ notification, totalNotRead }}>
      {children}
    </AppNotificationContext.Provider>
  )
}
