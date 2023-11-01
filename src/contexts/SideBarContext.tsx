'use client'

import { ReactNode, createContext, useState } from 'react'

type SidebarContextType = {
  collapsed: boolean
  toggle(): void
}

export const SidebarContext = createContext({} as SidebarContextType)

export function SidebarContextProvider({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(true)
  const toggle = () => {
    setCollapsed((value) => !value)
  }

  return (
    <SidebarContext.Provider value={{ collapsed, toggle }}>
      {children}
    </SidebarContext.Provider>
  )
}
