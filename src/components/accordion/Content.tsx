'use client'

import * as Accordion from '@radix-ui/react-accordion'
import { ReactNode } from 'react'

type ContentProps = {
  children: ReactNode
}

export default function Content({ children }: ContentProps) {
  return <Accordion.Content>{children}</Accordion.Content>
}
