'use client'

import { Editor } from '@tiptap/react'
import { createContext } from 'react'

export type ActiveBlock = 'paragraph' | 'h1' | 'h2' | 'h3'

export interface TextEditorContextType {
  editor: Editor | null
  activeMarks: {
    bold: boolean
    italic: boolean
    underline: boolean
  }
  activeBlock: ActiveBlock
  handleToggle: (
    action: 'toggleBold' | 'toggleItalic' | 'toggleUnderline',
  ) => (e: React.MouseEvent) => void
  handleSetBlock: (e: React.ChangeEvent<HTMLSelectElement>) => void
}

export const TextEditorContext = createContext({} as TextEditorContextType)
