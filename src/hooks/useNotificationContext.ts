import { CreateContextHook } from './createContextHook'
import { AppNotificationContext } from '@/contexts/AppNotificationContext'

export default function useNotificationContext() {
  return CreateContextHook(AppNotificationContext)
}
