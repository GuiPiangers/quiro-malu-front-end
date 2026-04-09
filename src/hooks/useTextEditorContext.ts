import { TextEditorContext } from '@/contexts/TextEditorContext'
import { CreateContextHook } from './createContextHook'

export default function useTextEditorContext() {
  return CreateContextHook(TextEditorContext)
}
