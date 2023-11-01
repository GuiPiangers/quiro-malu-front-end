import { SidebarContext } from '@/contexts/SidebarContext'
import { CreateContextHook } from './createContextHook'

export default function useSidebarContext() {
  return CreateContextHook(SidebarContext)
}
