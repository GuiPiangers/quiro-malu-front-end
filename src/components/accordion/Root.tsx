'use client'

import * as Accordion from '@radix-ui/react-accordion'
import { ReactNode } from 'react'

type RootProps = {
  children: ReactNode
}

export default function Root({ children }: RootProps) {
  return (
    <Accordion.Root type="multiple">
      <Accordion.Item value="valor">{children}</Accordion.Item>
    </Accordion.Root>
  )
}
