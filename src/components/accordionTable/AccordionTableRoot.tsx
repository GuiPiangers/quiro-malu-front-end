'use client'

import { Accordion } from '../accordion'
import { ReactNode } from 'react'

type AccordionTableProps = {
  children: ReactNode
}

export default function AccordionTableRoot({ children }: AccordionTableProps) {
  return <Accordion.Root>{children}</Accordion.Root>
}
