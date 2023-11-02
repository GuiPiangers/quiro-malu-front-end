'use client'

import * as Accordion from '@radix-ui/react-accordion'
import { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

type RowProps = {
  children: ReactNode
  className: string
}

export default function Row({ children, className }: RowProps) {
  return (
    <Accordion.Header>
      <Accordion.Trigger
        className={twMerge(
          'grid w-full items-center justify-items-start border-b px-2 py-1.5 hover:bg-zinc-100',
          className,
        )}
      >
        {children}
      </Accordion.Trigger>
    </Accordion.Header>
  )
}
