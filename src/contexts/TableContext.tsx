'use client'

import { ReactNode, createContext, useState, useCallback } from 'react'

type TableContextType = {
  columns: Array<string>
  setColumns(value: Array<string>): void
}

export const TableContext = createContext({} as TableContextType)

export function TableContextProvider({ children }: { children: ReactNode }) {
  const [columns, setColumnsState] = useState([''])
  const setColumns = useCallback((value: Array<string>) => {
    setColumnsState(value)
  }, [])

  return (
    <TableContext.Provider value={{ columns, setColumns }}>
      {children}
    </TableContext.Provider>
  )
}
