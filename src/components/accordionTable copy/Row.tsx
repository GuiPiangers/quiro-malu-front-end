/* eslint-disable react/display-name */
'use client'

import { ReactNode } from 'react'
import * as Accordion from '@radix-ui/react-accordion'
import { Table } from '../table'
import { RxCaretDown } from 'react-icons/rx'

type RowProps = {
  children: ReactNode
  className?: string
}

export const Row = function ({ children, className }: RowProps) {
  return (
    <Accordion.Header asChild>
      <Accordion.Trigger asChild>
        <Table.Row className={`${className} AccordionTrigger w-full`}>
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
