import { Accordion } from '../accordion'
import { HTMLAttributes } from 'react'
import { Table } from '../table'

type AccordionTableProps = HTMLAttributes<HTMLDivElement>

export default function AccordionTableRoot({
  children,
  ...props
}: AccordionTableProps) {
  return (
    <Accordion.Root>
      <Table.Root {...props}>{children}</Table.Root>
    </Accordion.Root>
  )
}
