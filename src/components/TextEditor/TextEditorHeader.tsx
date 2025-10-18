'use client'

import { Bold, Italic, Underline } from 'lucide-react'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import useTextEditorContext from '@/hooks/useTextEditorContext'

export function TextEditorHeader() {
  const { editor, activeMarks, activeBlock, handleToggle, handleSetBlock } =
    useTextEditorContext()

  if (!editor) {
    return null
  }

  return (
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
  )
}
