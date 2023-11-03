'use client'

import { ReactNode, useRef } from 'react'
import { Accordion } from '../accordion'

type ItemProps = {
  children: ReactNode
}

export const Item = function ({ children }: ItemProps) {
  return <Accordion.Item>{children}</Accordion.Item>
}
