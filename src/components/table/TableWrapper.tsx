'use client'

import { ReactNode, useEffect } from 'react'
import useTableContext from '@/hooks/TableContext'

type TableProps = {
  children: ReactNode
  columns: string[]
}

export default function TableWrapper({ children, columns }: TableProps) {
  const { setColumns } = useTableContext()
  useEffect(() => {
    setColumns(columns)
  }, [columns, setColumns])
  return <li className="list-none">{children}</li>
}
