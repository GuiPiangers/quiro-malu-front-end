'use client'

import { ReactNode, forwardRef } from 'react'
import * as Accordion from '@radix-ui/react-accordion'

type ItemProps = {
  children: ReactNode
  value: string
}

export const Item = function ({ children, value }: ItemProps) {
  return <Accordion.Item value={value}>{children}</Accordion.Item>
}
