import { IdContext } from '@/contexts/IdContext'
import { CreateContextHook } from './createContextHook'

export default function useIdContext() {
  return CreateContextHook(IdContext)
}
