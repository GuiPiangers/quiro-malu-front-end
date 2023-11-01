'use client'

import { ReactNode, createContext, useState, useEffect } from 'react'

type SideBarContextType = {
  collapsed: boolean
  toggle(): void
}

export const SideBarContext = createContext({} as SideBarContextType)

export function SideBarContextProvider({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const toggle = () => {
    setCollapsed((value) => !value)
  }

  return (
    <SideBarContext.Provider value={{ collapsed, toggle }}>
      {children}
    </SideBarContext.Provider>
  )
}
