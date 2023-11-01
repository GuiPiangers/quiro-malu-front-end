import { AuthContext } from '@/contexts/AuthContext'
import { CreateContextHook } from './createContextHook'

export default function useAuthContext() {
  return CreateContextHook(AuthContext)
}
