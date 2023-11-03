import { ToggleContext } from '@/contexts/ToggleContext'
import { CreateContextHook } from './createContextHook'

export default function useToggleContext() {
  return CreateContextHook(ToggleContext)
}
