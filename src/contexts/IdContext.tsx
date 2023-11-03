'use client'

import { ReactNode, createContext, useId } from 'react'

type IdContextType = {
  id: string
}

export const IdContext = createContext({} as IdContextType)

export function IdContextProvider({ children }: { children: ReactNode }) {
  const id = useId()

  return <IdContext.Provider value={{ id }}>{children}</IdContext.Provider>
}
