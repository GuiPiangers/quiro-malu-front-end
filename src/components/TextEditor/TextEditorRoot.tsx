'use client'

import { ReactNode, useCallback, useEffect, useState } from 'react'
import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import UnderlineExtension from '@tiptap/extension-underline'
import Heading from '@tiptap/extension-heading'
import { TextStyle } from '@tiptap/extension-text-style'
import { cn } from '@/lib/utils'
import { ActiveBlock, TextEditorContext } from '@/contexts/TextEditorContext'

interface TextEditorRootProps {
  content?: string
  onChange?: (richText: string) => void
  className?: string
  children?: ReactNode
  disabled?: boolean
}

export function TextEditorRoot({
  content,
  onChange,
  className,
  children,
  disabled,
}: TextEditorRootProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      UnderlineExtension,
      Heading.configure({ levels: [1, 2, 3] }),
      TextStyle,
    ],
    immediatelyRender: true,
    editable: !disabled,
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

  useEffect(() => {
    editor?.setEditable(!disabled)
  }, [disabled, editor])

  useEffect(() => {
    if (!editor) return
    const current = editor.getHTML()

    if (content && content !== current) {
      editor.commands.setContent(content, {
        emitUpdate: false,
      })
    }
  }, [content, editor])

  const [activeMarks, setActiveMarks] = useState({
    bold: false,
    italic: false,
    underline: false,
  })

  const [activeBlock, setActiveBlock] = useState<ActiveBlock>('paragraph')

  const updateStates = useCallback(() => {
    if (!editor) return
    const nextMarks = {
      bold: editor.isActive('bold'),
      italic: editor.isActive('italic'),
      underline: editor.isActive('underline'),
    }

    let nextBlock: ActiveBlock = 'paragraph'
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
    const block = e.target.value as ActiveBlock
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
    <TextEditorContext.Provider
      value={{ editor, activeMarks, activeBlock, handleToggle, handleSetBlock }}
    >
      <div
        className={cn(
          'border-input rounded-md border',
          disabled ? 'cursor-not-allowed bg-gray-100 opacity-70' : 'bg-white',
          className,
        )}
      >
        {children}
      </div>
    </TextEditorContext.Provider>
  )
}
