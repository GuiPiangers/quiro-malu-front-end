'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import React from 'react'

interface TextEditorProps {
  content: string
  onChange: (richText: string) => void
}

export function TextEditor({ content, onChange }: TextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    immediatelyRender: false,
    content,
    onUpdate({ editor }) {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class:
          'prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl focus:outline-none',
      },
    },
  })

  const editorClasses =
    'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'

  return <EditorContent editor={editor} className={editorClasses} />
}
