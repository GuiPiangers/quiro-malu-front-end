'use client'

import { InputField } from '@/components/input/InputField'
import type { inputVariantProps } from '@/components/input/InputField'
import { cn } from '@/lib/utils'
import {
  type BraceAutocompleteOption,
  filterBraceOptions,
  getActiveBraceQuery,
} from '@/lib/brace-autocomplete'
import { getTextareaCaretViewportPosition } from '@/lib/textarea-caret-position'
import type { InputProps } from '@mui/base/Input'
import type { ChangeEvent, KeyboardEvent } from 'react'
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'

const PANEL_WIDTH = 288
const MAX_LIST_HEIGHT = 192
const VIEWPORT_MARGIN = 8
const CARET_GAP = 6
const MIN_SPACE_TO_OPEN_BELOW = 100

type PanelPlacement = {
  top?: number
  bottom?: number
  left: number
  width: number
  maxHeight: number
}

export type BraceAutocompleteTextareaProps = Omit<
  InputProps & inputVariantProps,
  'onChange' | 'value' | 'multiline' | 'type'
> & {
  value: string
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void
  name?: string
  options: BraceAutocompleteOption[]
  openToken?: string
  closeToken?: string
}

export function BraceAutocompleteTextarea({
  value,
  onChange,
  onBlur,
  name,
  options,
  openToken = '{{',
  closeToken = '}}',
  className,
  disabled,
  slotProps: slotPropsProp,
  ...inputProps
}: BraceAutocompleteTextareaProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const [open, setOpen] = useState(false)
  const [filtered, setFiltered] = useState<BraceAutocompleteOption[]>([])
  const [activeIndex, setActiveIndex] = useState(0)
  const [panelPlacement, setPanelPlacement] = useState<PanelPlacement | null>(
    null,
  )
  /** Força recálculo da posição do popup quando só a seleção/cursor muda (setas, etc.). */
  const [layoutNonce, setLayoutNonce] = useState(0)

  const getTextarea = useCallback((): HTMLTextAreaElement | null => {
    return containerRef.current?.querySelector('textarea') ?? null
  }, [])

  const updatePanelPlacement = useCallback(() => {
    const ta = getTextarea()
    if (!ta || !open) {
      setPanelPlacement(null)
      return
    }

    const cursor = ta.selectionStart ?? value.length
    const caret = getTextareaCaretViewportPosition(ta, cursor)

    const vw = window.innerWidth
    const vh = window.innerHeight
    const panelWidth = Math.min(PANEL_WIDTH, vw - VIEWPORT_MARGIN * 2)
    const left = Math.min(
      Math.max(VIEWPORT_MARGIN, caret.left),
      vw - panelWidth - VIEWPORT_MARGIN,
    )

    const spaceBelow =
      vh - (caret.top + caret.height) - CARET_GAP - VIEWPORT_MARGIN
    const spaceAbove = caret.top - CARET_GAP - VIEWPORT_MARGIN

    const preferBelow =
      spaceBelow >= MIN_SPACE_TO_OPEN_BELOW || spaceBelow >= spaceAbove

    if (preferBelow) {
      setPanelPlacement({
        top: caret.top + caret.height + CARET_GAP,
        left,
        width: panelWidth,
        maxHeight: Math.min(MAX_LIST_HEIGHT, Math.max(80, spaceBelow)),
      })
    } else {
      setPanelPlacement({
        bottom: vh - caret.top + CARET_GAP,
        left,
        width: panelWidth,
        maxHeight: Math.min(MAX_LIST_HEIGHT, Math.max(80, spaceAbove)),
      })
    }
  }, [getTextarea, open, value])

  useLayoutEffect(() => {
    if (!open || filtered.length === 0) {
      setPanelPlacement(null)
      return
    }
    updatePanelPlacement()
  }, [open, filtered.length, value, layoutNonce, updatePanelPlacement])

  useEffect(() => {
    if (!open) return

    const onScrollOrResize = () => {
      requestAnimationFrame(() => updatePanelPlacement())
    }

    window.addEventListener('scroll', onScrollOrResize, true)
    window.addEventListener('resize', onScrollOrResize)
    const ta = getTextarea()
    ta?.addEventListener('scroll', onScrollOrResize)

    return () => {
      window.removeEventListener('scroll', onScrollOrResize, true)
      window.removeEventListener('resize', onScrollOrResize)
      ta?.removeEventListener('scroll', onScrollOrResize)
    }
  }, [open, getTextarea, updatePanelPlacement])

  const updateSuggestions = useCallback(
    (text: string, cursor: number) => {
      const ctx = getActiveBraceQuery(text, cursor, openToken, closeToken)
      if (!ctx) {
        setOpen(false)
        return
      }
      const list = filterBraceOptions(options, ctx.query, openToken, closeToken)
      setFiltered(list)
      setActiveIndex(0)
      setOpen(list.length > 0)
      setLayoutNonce((n) => n + 1)
    },
    [closeToken, openToken, options],
  )

  const applySelection = useCallback(
    (opt: BraceAutocompleteOption) => {
      const ta = getTextarea()
      if (!ta) return
      const cursor = ta.selectionStart ?? value.length
      const ctx = getActiveBraceQuery(value, cursor, openToken, closeToken)
      if (!ctx) return

      const next = value.slice(0, ctx.start) + opt.value + value.slice(cursor)

      const ev = {
        target: { value: next, name: name ?? '' },
        currentTarget: ta,
      } as ChangeEvent<HTMLTextAreaElement>
      onChange(ev)

      setOpen(false)

      const pos = ctx.start + opt.value.length
      requestAnimationFrame(() => {
        const el = getTextarea()
        if (!el) return
        el.focus()
        el.setSelectionRange(pos, pos)
      })
    },
    [closeToken, getTextarea, name, onChange, openToken, value],
  )

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      onChange(e as ChangeEvent<HTMLTextAreaElement>)
      const ta = e.target as HTMLTextAreaElement
      queueMicrotask(() =>
        updateSuggestions(ta.value, ta.selectionStart ?? ta.value.length),
      )
    },
    [onChange, updateSuggestions],
  )

  const handleSelect = useCallback(() => {
    const ta = getTextarea()
    if (!ta) return
    updateSuggestions(ta.value, ta.selectionStart ?? ta.value.length)
  }, [getTextarea, updateSuggestions])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (!open || filtered.length === 0) return

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActiveIndex((i) => (i + 1) % filtered.length)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActiveIndex((i) => (i - 1 + filtered.length) % filtered.length)
      } else if (e.key === 'Enter') {
        e.preventDefault()
        applySelection(filtered[activeIndex])
      } else if (e.key === 'Escape') {
        e.preventDefault()
        setOpen(false)
      }
    },
    [activeIndex, applySelection, filtered, open],
  )

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      window.setTimeout(() => setOpen(false), 150)
      onBlur?.(e as React.FocusEvent<HTMLTextAreaElement>)
    },
    [onBlur],
  )

  const mergedSlotProps = {
    ...slotPropsProp,
    input: {
      ...(typeof slotPropsProp?.input === 'object' && slotPropsProp.input
        ? slotPropsProp.input
        : {}),
    },
  }

  const fieldProps = {
    ...inputProps,
    multiline: true as const,
    className,
    disabled,
    value,
    name,
    onChange: handleChange,
    onSelect: handleSelect,
    onKeyDown: handleKeyDown,
    onBlur: handleBlur,
    onClick: handleSelect,
    slotProps: mergedSlotProps,
  }

  const list =
    open && filtered.length > 0 && panelPlacement ? (
      <ul
        role="listbox"
        className="z-[100] overflow-auto rounded-md border border-slate-200 bg-white py-1 text-sm shadow-lg outline-none"
        style={{
          position: 'fixed',
          top: panelPlacement.top,
          bottom: panelPlacement.bottom,
          left: panelPlacement.left,
          width: panelPlacement.width,
          maxHeight: panelPlacement.maxHeight,
        }}
        onMouseDown={(e) => e.preventDefault()}
      >
        {filtered.map((opt, idx) => (
          <li key={opt.value} role="option" aria-selected={idx === activeIndex}>
            <button
              type="button"
              title={opt.description}
              className={cn(
                'flex w-full px-3 py-2 text-left font-mono text-xs text-slate-800 hover:bg-purple-50',
                idx === activeIndex && 'bg-purple-100 text-main',
              )}
              onMouseEnter={() => setActiveIndex(idx)}
              onClick={() => applySelection(opt)}
            >
              {opt.label}
            </button>
          </li>
        ))}
      </ul>
    ) : null

  return (
    <div ref={containerRef} className="relative w-full">
      <InputField
        {...(fieldProps as React.ComponentProps<typeof InputField>)}
      />
      {typeof document !== 'undefined' && list
        ? createPortal(list, document.body)
        : null}
    </div>
  )
}
