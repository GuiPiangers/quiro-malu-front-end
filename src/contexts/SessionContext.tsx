'use client'

import { createContext, ReactNode, useContext } from 'react'

type SessionContextValue = {
  userId: string
}

const SessionContext = createContext<SessionContextValue | null>(null)

export function SessionProvider({
  userId,
  children,
}: {
  userId: string
  children: ReactNode
}) {
  return (
    <SessionContext.Provider value={{ userId }}>
      {children}
    </SessionContext.Provider>
  )
}

export function useSession() {
  const session = useContext(SessionContext)
  if (!session) {
    throw new Error('useSession must be used within SessionProvider')
  }
  return session
}

export function useOptionalSession() {
  return useContext(SessionContext)
}
