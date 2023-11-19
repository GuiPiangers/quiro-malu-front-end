'use client'

import useWindowSize from '@/hooks/useWindowSize'
import {
  ReactNode,
  createContext,
  useState,
  useCallback,
  useEffect,
} from 'react'

type ToggleContextType = {
  collapsed: boolean
  toggle(): void
}

export const ToggleContext = createContext({} as ToggleContextType)

export function ToggleContextProvider({ children }: { children: ReactNode }) {
  const { windowWidth } = useWindowSize()
  const [collapsed, setCollapsed] = useState(false)
  const toggle = useCallback(() => {
    setCollapsed((value) => !value)
  }, [])

  useEffect(() => {
    const isLgScreen = windowWidth < 1024
    setCollapsed(isLgScreen)
  }, [windowWidth])

  return (
    <ToggleContext.Provider value={{ collapsed, toggle }}>
      {children}
    </ToggleContext.Provider>
  )
}
