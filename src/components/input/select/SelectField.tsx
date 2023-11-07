'use client'

import {
  forwardRef,
  useId,
  useRef,
  useState,
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
} from 'react'
import InputField, { InputFieldProps } from '../InputField'
import { RxCaretDown } from 'react-icons/rx'
import OptionList from './OptionList'
import InputWrapper from '../InputWrapper'
import { inputStyles } from '../Styles'
import useIdContext from '@/hooks/useIdContext'

type SelectContextType = {
  value: string
  setValue: Dispatch<SetStateAction<string>>
  visible: boolean
  setVisible: Dispatch<SetStateAction<boolean>>
}

export const SelectContext = createContext({} as SelectContextType)

export const SelectField = (
  { children, disabled, error, leftIcon, rightIcon, ...props }: InputFieldProps,
  ref: any,
) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const selectRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [value, setValue] = useState('')
  const optionListId = `slc-cont-${useId()}`
  const containerWidth = containerRef.current?.clientWidth
  const [focus, setFocus] = useState(false)
  const { id: inputId } = useIdContext()
  const { inputFieldStyle } = inputStyles({
    disabled,
    error,
    focus,
  })

  return (
    <SelectContext.Provider value={{ value, setValue, visible, setVisible }}>
      <div className="group" ref={containerRef} data-expanded={visible}>
        <InputWrapper
          ref={selectRef}
          focus={focus}
          tabIndex={0}
          className="group-data-[expanded=true]:outline group-data-[expanded=true]:outline-1 group-data-[expanded=true]:outline-blue-500 group-data-[expanded=true]:ring-4 group-data-[expanded=true]:ring-blue-100"
          onClick={() => setVisible((value) => !value)}
          onKeyDown={(e) => {
            if (e.key === ' ' || e.key === 'Enter')
              setVisible((value) => !value)
            if (e.key === 'ArrowDown') setVisible(true)
          }}
          leftIcon={<div>{leftIcon}</div>}
          rightIcon={
            <div className="flex items-center justify-center px-1">
              {rightIcon}
              <RxCaretDown
                size={24}
                className="flex h-full items-center justify-center justify-self-end transition duration-200 ease-out group-data-[expanded=true]:rotate-180"
              />
            </div>
          }
        >
          <input
            {...props}
            id={inputId}
            ref={ref}
            value={value}
            readOnly
            role="combobox"
            aria-expanded={visible}
            aria-controls={optionListId}
            className={inputFieldStyle({
              className: 'w-full cursor-default',
            })}
            onFocus={() => {
              setFocus(true)
            }}
            onBlur={() => setFocus(false)}
          />
        </InputWrapper>

        <div className="absolute ">
          {visible && (
            <OptionList
              containerRef={containerRef}
              selectRef={selectRef}
              style={{ width: containerWidth }}
              id={optionListId}
            >
              {children}
            </OptionList>
          )}
        </div>
      </div>
    </SelectContext.Provider>
  )
}

export default forwardRef(SelectField)
