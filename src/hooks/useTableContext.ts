import { TableContext } from '@/contexts/TableContext'
import { CreateContextHook } from './createContextHook'

export default function useTableContext() {
  return CreateContextHook(TableContext)
}
