'use client'

import useTextEditorContext from '@/hooks/useTextEditorContext'
import { cn } from '@/lib/utils'
import { EditorContent } from '@tiptap/react'

export function TextEditorEditor({ className }: { className?: string }) {
  const { editor } = useTextEditorContext()

  return (
    <div
      className={cn('w-full cursor-text px-3 py-3', className)}
      onClick={() => editor?.commands.focus()}
    >
      <EditorContent editor={editor} />
    </div>
  )
}
