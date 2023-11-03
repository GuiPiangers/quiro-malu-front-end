import { ToggleGroupContext } from '@/contexts/ToggleGroupContext'
import { CreateContextHook } from './createContextHook'

export default function useToggleGroupContext() {
  return CreateContextHook(ToggleGroupContext)
}
