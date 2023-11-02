'use client'

import * as Accordion from '@radix-ui/react-accordion'
import { Table } from '../table'
import { ReactNode } from 'react'

type AccordionTableProps = {
  children: ReactNode
}

export default function AccordionTableRoot({ children }: AccordionTableProps) {
  return (
    <Accordion.Root type="multiple">
      <Table.Root>{children}</Table.Root>
    </Accordion.Root>
  )
}
