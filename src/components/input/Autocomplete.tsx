'use client'

import { ForwardedRef, forwardRef, useCallback, useRef, useState } from 'react'
import {
  useAutocomplete,
  UseAutocompleteProps,
} from '@mui/base/useAutocomplete'
import { Button } from '@mui/base/Button'
import { Popper } from '@mui/base/Popper'
import { unstable_useForkRef as useForkRef } from '@mui/utils'
import { inputStyles, inputVariantProps } from './InputField'
import { listBoxStyle } from './select/SelectField'
import { OptionStyle } from './select/Option'
import { RxCross2 } from 'react-icons/rx'
import useIdContext from '@/hooks/useIdContext'

export default forwardRef(function Autocomplete(
  props: UseAutocompleteProps<
    { label: string; id: string } & { [key: string]: any },
    boolean,
    boolean,
    boolean
  > &
    inputVariantProps & {
      onLastOptionView(): void
      condition?: boolean
    },
  ref: ForwardedRef<HTMLDivElement>,
) {
  const [highlightOption, setHighlightOption] = useState<undefined | string>()
  const [limitCount, setLimitCount] = useState(1)

  const {
    disableClearable = false,
    disabled = false,
    readOnly = false,
    error,
    notSave,
    onLastOptionView,
    condition,
    ...other
  } = props

  const {
    getRootProps,
    getInputProps,
    getClearProps,
    getListboxProps,
    getOptionProps,
    dirty,
    id,
    popupOpen,
    focused,
    anchorEl,
    setAnchorEl,
    groupedOptions,
  } = useAutocomplete({
    ...props,
    onHighlightChange(event, option, reason) {
      setHighlightOption(option?.id)
    },
    isOptionEqualToValue(option, value) {
      return option.id === value.id
    },
    componentName: 'BaseAutocompleteIntroduction',
  })
  const { id: contextId } = useIdContext()
  const hasClearIcon = !disableClearable && !disabled && dirty && !readOnly

  const rootRef = useForkRef(ref, setAnchorEl)

  const observer = useRef<IntersectionObserver>()
  const lastOptionElementRef = useCallback(
    (node: HTMLLIElement) => {
      if (observer.current) observer.current.disconnect()
      if (condition) return
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          if (onLastOptionView) {
            onLastOptionView()
          }
        }
      })
      if (node) observer.current.observe(node)
    },
    [onLastOptionView, condition],
  )

  const { inputWrapperStyle, inputFieldStyle } = inputStyles({
    focus: focused,
    error,
    disabled,
    notSave,
  })

  return (
    <>
      <div
        {...getRootProps(other)}
        ref={rootRef}
        className={inputWrapperStyle({
          className: getRootProps(other).className,
        })}
      >
        <input
          id={contextId || id}
          disabled={disabled}
          readOnly={readOnly}
          {...getInputProps()}
          className={inputFieldStyle()}
        />
        {hasClearIcon && (
          <Button
            {...getClearProps()}
            className="mr-2 self-center rounded-[4px] border-0 bg-transparent p-0.5 shadow-none outline-0 hover:cursor-pointer hover:bg-violet-100"
          >
            <RxCross2 />
          </Button>
        )}
      </div>
      {anchorEl && (
        <Popper
          open={popupOpen}
          anchorEl={anchorEl}
          slotProps={{
            root: {
              className: 'relative z-[1001] w-[420px]', // z-index: 1001 is needed to override ComponentPageTabs with z-index: 1000
            },
          }}
          modifiers={[
            { name: 'flip', enabled: true },
            { name: 'preventOverflow', enabled: true },
          ]}
        >
          <ul
            {...getListboxProps()}
            className={listBoxStyle({
              className: 'z-[1] max-h-[200px]',
            })}
          >
            {(
              groupedOptions as Array<
                { label: string; id: string } & { [key: string]: any }
              >
            ).map((option, index) => {
              const optionProps = getOptionProps({ option, index })
              if (groupedOptions.length === index + 1) {
                return (
                  <li
                    {...optionProps}
                    key={option.id}
                    ref={lastOptionElementRef}
                    className={OptionStyle({
                      selected: optionProps['aria-selected'] === true,
                      highlighted: highlightOption === option.id,
                    })}
                  >
                    {option.label}
                  </li>
                )
              }
              return (
                <li
                  {...optionProps}
                  key={option.id}
                  className={OptionStyle({
                    selected: optionProps['aria-selected'] === true,
                    highlighted: highlightOption === option.id,
                  })}
                >
                  {option.label}
                </li>
              )
            })}
            {groupedOptions.length === 0 && (
              <li className="cursor-default list-none p-2">No results</li>
            )}
          </ul>
        </Popper>
      )}
    </>
  )
})
