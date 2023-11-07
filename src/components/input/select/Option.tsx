'use client'

import { ReactNode, useContext } from 'react'
import { SelectContext } from './SelectField'
import { twMerge } from 'tailwind-merge'

export default function Option({
  children,
  className,
  value,
}: {
  children?: ReactNode
  className?: string
  value: string
}) {
  const {
    setValue,
    value: selectedValue,
    setVisible,
  } = useContext(SelectContext)

  const handleSelect = () => {
    setValue(value)
    setVisible(false)
  }
  return (
    <li
      onClick={handleSelect}
      tabIndex={-1}
      onKeyDown={(e) => {
        if (e.key === ' ' || e.key === 'Enter') handleSelect()
      }}
      aria-selected={selectedValue === value}
      role="option"
      className={twMerge(
        'cursor-default select-none rounded-sm p-1 text-sm hover:bg-blue-100 focus-visible:bg-blue-100 focus-visible:outline-none aria-selected:bg-blue-600 aria-selected:text-white aria-selected:focus-visible:bg-blue-700',
        className,
      )}
    >
      {children}
    </li>
  )
}
