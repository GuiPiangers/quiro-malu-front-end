import { SideBarContext } from '@/contexts/SideBarContext'
import { CreateContextHook } from './createContextHook'

export default function useSideBarContext() {
  return CreateContextHook(SideBarContext)
}
