'use client'

import { ReactNode, createContext, useState, useCallback } from 'react'

type ToggleGroupContextType = {
  active: string
  setActive(value: string): void
}

export const ToggleGroupContext = createContext({} as ToggleGroupContextType)

export function ToggleGroupContextProvider({
  children,
}: {
  children: ReactNode
}) {
  const [active, setActiveItem] = useState('')

  const setActive = useCallback(
    (value: string) => {
      if (active === value) {
        setActiveItem('')
      } else {
        setActiveItem(value)
      }
    },
    [active],
  )

  return (
    <ToggleGroupContext.Provider value={{ active, setActive }}>
      {children}
    </ToggleGroupContext.Provider>
  )
}
