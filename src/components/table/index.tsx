import { TableContextProvider } from '@/contexts/TableContext'
import { ReactNode } from 'react'
import TableWrapper from './TableWrapper'
import Trow from './TRow'
import THead from './THead'

type TableRootProps = {
  children: ReactNode
  columns: string[]
}

function TableRoot({ children, columns }: TableRootProps) {
  return (
    <TableContextProvider>
      <TableWrapper columns={columns}>{children}</TableWrapper>
    </TableContextProvider>
  )
}

export const Table = {
  Root: TableRoot,
  Row: Trow,
  Head: THead,
}
