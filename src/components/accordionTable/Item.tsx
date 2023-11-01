'use client'

import { ReactNode } from 'react'
import * as Accordion from '@radix-ui/react-accordion'

type ItemProps = {
  children: ReactNode
  value: string
}

export default function Item({ children, value }: ItemProps) {
  return <Accordion.Item value={value}>{children}</Accordion.Item>
}
