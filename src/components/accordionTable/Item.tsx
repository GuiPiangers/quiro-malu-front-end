'use client'

import { ReactNode, useRef } from 'react'
import * as Accordion from '@radix-ui/react-accordion'

type ItemProps = {
  children: ReactNode
  value: string
}

export const Item = function ({ children, value }: ItemProps) {
  const rowRer = useRef<HTMLDivElement>(null)

  const template = rowRer.current?.parentElement?.getAttribute('data-template')

  return (
    <Accordion.Item ref={rowRer} value={value} data-template={template}>
      {children}
    </Accordion.Item>
  )
}
