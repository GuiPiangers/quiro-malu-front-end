'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import UnderlineExtension from '@tiptap/extension-underline'
import { Bold, Italic, Underline } from 'lucide-react'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

interface TextEditorProps {
  content?: string
  onChange?: (richText: string) => void
}

export function TextEditor({ content, onChange }: TextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit, UnderlineExtension],
    immediatelyRender: true, // conforme você precisa para evitar hydration errors no Next
    content,
    onUpdate({ editor }) {
      onChange?.(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert prose-sm focus:outline-none w-full',
      },
    },
  })

  const [activeMarks, setActiveMarks] = useState({
    bold: false,
    italic: false,
    underline: false,
  })

  // função reutilizável para sincronizar o estado
  const updateActiveMarks = useCallback(() => {
    if (!editor) return
    const next = {
      bold: editor.isActive('bold'),
      italic: editor.isActive('italic'),
      underline: editor.isActive('underline'),
    }
    setActiveMarks((prev) =>
      prev.bold === next.bold &&
      prev.italic === next.italic &&
      prev.underline === next.underline
        ? prev
        : next,
    )
  }, [editor])

  useEffect(() => {
    if (!editor) return

    // fallback DOM events
    const dom = editor.view?.dom
    const onMouseUp = () => setTimeout(updateActiveMarks, 0)
    const onKeyUp = () => setTimeout(updateActiveMarks, 0)
    const onSelectionChange = () => setTimeout(updateActiveMarks, 0)

    dom?.addEventListener('mouseup', onMouseUp)
    dom?.addEventListener('keyup', onKeyUp)
    document.addEventListener('selectionchange', onSelectionChange)

    // sincroniza imediatamente (útil após carregar conteúdo)
    updateActiveMarks()

    return () => {
      dom?.removeEventListener('mouseup', onMouseUp)
      dom?.removeEventListener('keyup', onKeyUp)
      document.removeEventListener('selectionchange', onSelectionChange)
    }
  }, [editor, updateActiveMarks])

  // handler que usa onMouseDown para evitar blur e atualiza o estado logo após o comando
  const handleToggle =
    (action: 'toggleBold' | 'toggleItalic' | 'toggleUnderline') =>
    (e: React.MouseEvent) => {
      // evita que o botão roube foco/seleção do editor
      e.preventDefault()

      if (!editor) return

      // aplica o comando e em seguida sincroniza o estado
      editor.chain().focus()[action]().run()
      // small delay para garantir que a transação foi aplicada antes de ler estado
      setTimeout(updateActiveMarks, 0)
    }

  return (
    <div className="border-input rounded-md border">
      {editor && (
        <div className="border-b p-1">
          <ToggleGroup
            type="multiple"
            className="justify-start"
            value={Object.entries(activeMarks)
              .filter(([_, active]) => active)
              .map(([mark]) => mark)}
          >
            <ToggleGroupItem
              value="bold"
              aria-label="Toggle bold"
              onMouseDown={handleToggle('toggleBold')}
            >
              <Bold className="h-4 w-4" />
            </ToggleGroupItem>

            <ToggleGroupItem
              value="italic"
              aria-label="Toggle italic"
              onMouseDown={handleToggle('toggleItalic')}
            >
              <Italic className="h-4 w-4" />
            </ToggleGroupItem>

            <ToggleGroupItem
              value="underline"
              aria-label="Toggle underline"
              onMouseDown={handleToggle('toggleUnderline')}
            >
              <Underline className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      )}
      <div
        className="min-h-[80px] w-full px-3 py-2"
        onClick={() => editor?.commands.focus()}
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
