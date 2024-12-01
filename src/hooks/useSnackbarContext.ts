import { SnackbarContext } from '@/components/snackbar/Snackbar'
import { CreateContextHook } from './createContextHook'

export default function useSnackbarContext() {
  return CreateContextHook(SnackbarContext)
}
