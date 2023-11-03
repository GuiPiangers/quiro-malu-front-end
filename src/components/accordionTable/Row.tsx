'use client'

import { ReactNode } from 'react'
import { RxCaretDown } from 'react-icons/rx'
import { Accordion } from '../accordion'
import { TrowStyle } from '../table/TRow'

type RowProps = {
  children: ReactNode
  className?: string
}

export default function Row({ children, className }: RowProps) {
  return (
    <Accordion.Trigger className={TrowStyle({ className })}>
      {children}
      <RxCaretDown
        size={24}
        className="flex h-full items-center justify-center"
      />
    </Accordion.Trigger>
  )
}
