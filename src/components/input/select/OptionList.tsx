'use client'

import {
  Children,
  HTMLAttributes,
  JSXElementConstructor,
  ReactElement,
  ReactNode,
  RefObject,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { SelectContext } from './SelectField'
type OptionListProps = {
  containerRef?: RefObject<HTMLDivElement>
  selectRef?: RefObject<HTMLDivElement>
} & HTMLAttributes<HTMLUListElement>

export default function OptionList({
  children,
  id,
  containerRef,
  selectRef,
  ...props
}: OptionListProps) {
  const { setVisible, value } = useContext(SelectContext)
  const [focused, setFocus] = useState(0)
  const optionListRef = useRef<HTMLUListElement>(null)
  const [searchValue, setSearchValue] = useState<string>('')
  const timeSearchingRef = useRef<any>(null)

  const setVisibleFalse = useCallback(
    (e: any) => {
      if (!containerRef?.current?.contains(e.target)) {
        setVisible(false)
        document.removeEventListener('mousedown', setVisibleFalse)
      }
    },
    [containerRef, setVisible],
  )
  const focusNext = () => {
    if (focused < Children.count(children) - 1) setFocus((value) => value + 1)
    else setFocus(0)
  }
  const focusPrev = () => {
    if (focused > 0) setFocus((value) => value - 1)
    else setFocus(Children.count(children) - 1)
  }

  const searchAndFocus = (valueSearch: string, childrenArray: any) => {
    if (!children) return
    const values = Children.map(
      children as any,
      (
        child: ReactElement<any, string | JSXElementConstructor<any>>,
        index,
      ) => {
        if (child) {
          return {
            value: child.props.value,
            index,
          }
        }
      },
    )
    const matchedValue = values.find((valueItem) => {
      return valueItem.value.toLowerCase().match(searchValue)
    })
    setFocus((current) => matchedValue?.index ?? current)
    childrenArray[matchedValue?.index ?? focused].focus()
    console.log(focused)
  }

  useEffect(() => {
    const childrenArray = Array.from(
      optionListRef.current?.children as any,
    ) as Array<any>
    document.addEventListener('mousedown', setVisibleFalse)
    if (value) {
      childrenArray.forEach((child: any, index) => {
        const attribute = child.getAttribute('aria-selected')
        if (attribute === 'true') {
          setFocus(index)
          child.focus()
        }
      })
    } else {
      setFocus(0)
      childrenArray[0].focus()
    }
  }, [value, setVisibleFalse])

  useEffect(() => {
    if (timeSearchingRef.current) clearInterval(timeSearchingRef.current)
    timeSearchingRef.current = setTimeout(() => setSearchValue(''), 1000)
    // return clearInterval(timeSearchingRef.current)
  }, [searchValue])

  return (
    <ul
      {...props}
      id={id}
      ref={optionListRef}
      className="relative top-1 rounded border bg-white p-2 focus:bg-black"
      onKeyDownCapture={async (e) => {
        const childrenArray = optionListRef.current?.children as any
        const selectTrigger = selectRef?.current?.children?.item(1) as any

        if (e.key === 'ArrowDown') {
          focusNext()
          return childrenArray[focused].focus()
        }
        if (e.key === 'ArrowUp') {
          focusPrev()
          return childrenArray[focused].focus()
        }
        if (e.key === 'Escape' || e.key === 'Tab') {
          setVisible(false)
          return selectTrigger.focus()
        }
        if (e.key === 'Enter' || e.key === ' ') {
          return selectTrigger.focus()
        } else {
          setSearchValue((current) => current + e.key)
          searchAndFocus(e.key, childrenArray)

          console.log(searchValue)
        }
      }}
    >
      {children}
    </ul>
  )
}
