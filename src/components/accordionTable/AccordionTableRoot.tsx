'use client'

import * as Accordion from '@radix-ui/react-accordion'
import { Table } from '../table'
import { ReactNode, useEffect, useState } from 'react'

type AccordionTableProps = {
  children: ReactNode
  columns: string[]
}

export default function AccordionTableRoot({
  children,
  columns,
}: AccordionTableProps) {
  const accordionColumns = [...columns, '32px']
  const [domLoaded, setDomLoaded] = useState(false)

  useEffect(() => {
    setDomLoaded(true)
  }, [])
  return (
    <>
      {domLoaded && (
        <Accordion.Root type="multiple">
          <Table.Root columns={accordionColumns}>{children}</Table.Root>
        </Accordion.Root>
      )}
    </>
  )
}
