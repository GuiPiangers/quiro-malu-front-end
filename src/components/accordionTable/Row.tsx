'use client'

import { ReactNode } from 'react'
import * as Accordion from '@radix-ui/react-accordion'
import { Table } from '../table'
import { RxCaretDown } from 'react-icons/rx'

type RowProps = {
  children: ReactNode
  className?: string
}

export default function Row({ children, className }: RowProps) {
  return (
    <Accordion.Header asChild>
      <Accordion.Trigger className="AccordionTrigger w-full" asChild>
        <Table.Row className={className}>
          {children}
          <RxCaretDown
            size={24}
            className="AccordionChevron flex h-full items-center justify-center"
          />
        </Table.Row>
      </Accordion.Trigger>
    </Accordion.Header>
  )
}
