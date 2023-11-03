'use client'

import { ReactNode, createContext, useState, useCallback } from 'react'

type ToggleContextType = {
  collapsed: boolean
  toggle(): void
}

export const ToggleContext = createContext({} as ToggleContextType)

export function ToggleContextProvider({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(true)
  const toggle = useCallback(() => {
    setCollapsed((value) => !value)
  }, [])

  return (
    <ToggleContext.Provider value={{ collapsed, toggle }}>
      {children}
    </ToggleContext.Provider>
  )
}
