'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import UnderlineExtension from '@tiptap/extension-underline'
import Heading from '@tiptap/extension-heading'
import { TextStyle } from '@tiptap/extension-text-style'
import { Bold, Italic, Underline } from 'lucide-react'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

interface TextEditorProps {
  content?: string
  onChange?: (richText: string) => void
}

export function TextEditor({ content, onChange }: TextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      UnderlineExtension,
      Heading.configure({ levels: [1, 2, 3] }),
      TextStyle,
    ],
    immediatelyRender: true,
    content,
    onUpdate({ editor }) {
      onChange?.(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class:
          'prose dark:prose-invert prose-sm focus:outline-none w-full prose-p:my-1',
      },
    },
  })

  const [activeMarks, setActiveMarks] = useState({
    bold: false,
    italic: false,
    underline: false,
  })

  const [activeBlock, setActiveBlock] = useState<
    'paragraph' | 'h1' | 'h2' | 'h3'
  >('paragraph')

  const updateStates = useCallback(() => {
    if (!editor) return
    const nextMarks = {
      bold: editor.isActive('bold'),
      italic: editor.isActive('italic'),
      underline: editor.isActive('underline'),
    }

    // bloco atual: checa heading level ou paragraph
    let nextBlock: typeof activeBlock = 'paragraph'
    if (editor.isActive('heading', { level: 1 })) nextBlock = 'h1'
    else if (editor.isActive('heading', { level: 2 })) nextBlock = 'h2'
    else if (editor.isActive('heading', { level: 3 })) nextBlock = 'h3'
    else nextBlock = 'paragraph'

    setActiveMarks((prev) =>
      prev.bold === nextMarks.bold &&
      prev.italic === nextMarks.italic &&
      prev.underline === nextMarks.underline
        ? prev
        : nextMarks,
    )

    setActiveBlock((prev) => (prev === nextBlock ? prev : nextBlock))
  }, [editor])

  useEffect(() => {
    if (!editor) return

    editor.on('selectionUpdate', updateStates)
    editor.on('transaction', updateStates)
    editor.on('focus', updateStates)
    editor.on('blur', updateStates)

    const dom = editor.view?.dom
    const onMouseUp = () => setTimeout(updateStates, 0)
    const onKeyUp = () => setTimeout(updateStates, 0)
    const onSelectionChange = () => setTimeout(updateStates, 0)

    dom?.addEventListener('mouseup', onMouseUp)
    dom?.addEventListener('keyup', onKeyUp)
    document.addEventListener('selectionchange', onSelectionChange)

    updateStates()

    return () => {
      editor.off('selectionUpdate', updateStates)
      editor.off('transaction', updateStates)
      editor.off('focus', updateStates)
      editor.off('blur', updateStates)

      dom?.removeEventListener('mouseup', onMouseUp)
      dom?.removeEventListener('keyup', onKeyUp)
      document.removeEventListener('selectionchange', onSelectionChange)
    }
  }, [editor, updateStates])

  const handleToggle =
    (action: 'toggleBold' | 'toggleItalic' | 'toggleUnderline') =>
    (e: React.MouseEvent) => {
      e.preventDefault()
      if (!editor) return
      editor.chain().focus()[action]().run()
      setTimeout(updateStates, 0)
    }

  const handleSetBlock = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const block = e.target.value as 'paragraph' | 'h1' | 'h2' | 'h3'
    if (!editor) return
    if (block === 'paragraph') {
      editor.chain().focus().setNode('paragraph').run()
    } else {
      const level = block === 'h1' ? 1 : block === 'h2' ? 2 : 3
      editor.chain().focus().setNode('heading', { level }).run()
    }
    setTimeout(updateStates, 0)
  }

  return (
    <div className="border-input rounded-md border">
      {editor && (
        <div className="flex flex-col gap-2 border-b p-2">
          <div className="flex items-center gap-2">
            <ToggleGroup
              type="multiple"
              value={Object.entries(activeMarks)
                .filter(([_, v]) => v)
                .map(([k]) => k)}
            >
              <ToggleGroupItem
                value="bold"
                aria-label="Bold"
                onMouseDown={handleToggle('toggleBold')}
              >
                <Bold className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem
                value="italic"
                aria-label="Italic"
                onMouseDown={handleToggle('toggleItalic')}
              >
                <Italic className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem
                value="underline"
                aria-label="Underline"
                onMouseDown={handleToggle('toggleUnderline')}
              >
                <Underline className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>

            <div className="ml-4">
              <label className="sr-only">Tipo de bloco</label>
              <select
                value={activeBlock}
                onChange={handleSetBlock}
                className="cursor-pointer rounded-md border-none bg-transparent px-2 py-1 text-sm font-medium ring-offset-white transition-colors hover:bg-slate-200"
              >
                <option value="paragraph">Parágrafo</option>
                <option value="h1">Título 1</option>
                <option value="h2">Título 2</option>
                <option value="h3">Título 3</option>
              </select>
            </div>
          </div>
        </div>
      )}

      <div
        className="min-h-[120px] w-full px-3 py-3"
        onClick={() => editor?.commands.focus()}
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
