'use client'

import {
  forwardRef,
  useState,
  useRef,
  useCallback,
  ForwardedRef,
  KeyboardEvent,
} from 'react'
import { Popper } from '@mui/base/Popper'
import { RxCross2 } from 'react-icons/rx'
import Button from '../Button'
import useIdContext from '@/hooks/useIdContext'
import { inputStyles } from './InputField'
import { listBoxStyle } from './select/SelectField'
import { OptionStyle } from './select/Option'
import { useForkRef } from '@/hooks/useForkRef'
import { useDebouncing } from '@/hooks/useDebouncing'

type SearchResult<T> = { label: string; data: T }

interface AsyncAutocompleteProps<T> {
  searchTerm(term: string): Promise<SearchResult<T>[]>
  onLastOptionView?(): void
  condition?: boolean
  disabled?: boolean
  readOnly?: boolean
  disableClearable?: boolean
  error?: boolean
  notSave?: boolean
}

function AsyncAutocompleteInner<T>(
  {
    searchTerm,
    onLastOptionView,
    condition,
    disabled = false,
    readOnly = false,
    disableClearable = false,
    error,
    notSave,
  }: AsyncAutocompleteProps<T>,
  ref: ForwardedRef<HTMLDivElement>,
) {
  const [options, setOptions] = useState<SearchResult<T>[]>([])
  const [open, setOpen] = useState(false)
  const [highlightIndex, setHighlightIndex] = useState<number>(-1)
  const [selected, setSelected] = useState<SearchResult<T> | null>(null)

  const anchorEl = useRef<HTMLDivElement | null>(null)
  const popperRef = useRef<HTMLDivElement | null>(null)
  const rootRef = useForkRef(ref, anchorEl)

  // --- debounce hook ---
  const [debouncedValue, setInputValue, value] = useDebouncing({
    onDebounce({ value }) {
      const fetchOptions = async () => {
        const results = await searchTerm(value)
        setOptions(results)
      }
      fetchOptions()
    },
  })

  // --- handlers ---
  const handleInputChange = (value: string) => {
    setInputValue(value) // dispara debounce
    setSelected(null)
  }

  const handleSelect = (option: SearchResult<T>) => {
    setSelected(option)
    setInputValue(option.label)
    setOpen(false)
  }

  const handleClear = () => {
    setInputValue('')
    setSelected(null)
    setOptions([])
    setOpen(false)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!open) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlightIndex((prev) => Math.min(prev + 1, options.length - 1))
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlightIndex((prev) => Math.max(prev - 1, 0))
    }
    if (e.key === 'Enter' && highlightIndex >= 0) {
      e.preventDefault()
      handleSelect(options[highlightIndex])
    }
    if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  // --- observer para scroll infinito ---
  const observer = useRef<IntersectionObserver>()
  const lastOptionElementRef = useCallback(
    (node: HTMLLIElement) => {
      if (observer.current) observer.current.disconnect()
      if (condition) return
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && onLastOptionView) {
          onLastOptionView()
        }
      })
      if (node) observer.current.observe(node)
    },
    [onLastOptionView, condition],
  )

  const { inputWrapperStyle, inputFieldStyle } = inputStyles({
    focus: open,
    error,
    disabled,
    notSave,
  })
  const { id: contextId } = useIdContext()

  return (
    <>
      <div ref={rootRef} className={inputWrapperStyle()}>
        <input
          id={contextId}
          disabled={disabled}
          readOnly={readOnly}
          value={selected?.label ?? value}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => {
            setOpen(true)
          }}
          onBlur={() => setOpen(false)}
          onKeyDown={handleKeyDown}
          className={inputFieldStyle()}
        />
        {!disableClearable && !disabled && debouncedValue && !readOnly && (
          <Button
            type="button"
            onClick={handleClear}
            className="mr-2 self-center rounded-[4px] border-0 bg-transparent p-0.5 shadow-none outline-0 hover:cursor-pointer hover:bg-violet-100"
          >
            <RxCross2 className="text-black" />
          </Button>
        )}
      </div>

      {anchorEl.current && (
        <Popper
          open={open}
          anchorEl={anchorEl.current}
          slotProps={{
            root: { className: 'relative z-[1001] w-[420px]' },
          }}
        >
          <div ref={popperRef}>
            <ul
              className={listBoxStyle({
                className: 'z-[1] max-h-[200px]',
              })}
            >
              {options.map((option, index) => {
                const isHighlighted = highlightIndex === index
                const isSelected = selected?.label === option.label
                const isLast = options.length === index + 1

                return (
                  <li
                    key={option.label}
                    ref={isLast ? lastOptionElementRef : undefined}
                    className={OptionStyle({
                      selected: isSelected,
                      highlighted: isHighlighted,
                    })}
                    onMouseDown={() => handleSelect(option)}
                    onMouseEnter={() => setHighlightIndex(index)}
                  >
                    {option.label}
                  </li>
                )
              })}

              {options.length === 0 && debouncedValue && (
                <li className="cursor-default list-none p-2">No results</li>
              )}
            </ul>
          </div>
        </Popper>
      )}
    </>
  )
}

export const AsyncAutocomplete = forwardRef(AsyncAutocompleteInner)
