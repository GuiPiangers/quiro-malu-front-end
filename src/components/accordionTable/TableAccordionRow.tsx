import { HTMLAttributes } from 'react'
import { RxCaretDown } from 'react-icons/rx'
import { Accordion } from '../accordion'
import { Table } from '../table'
import { twMerge } from 'tailwind-merge'

type RowProps = { columns: string[] } & HTMLAttributes<HTMLDivElement>

export default function TableAccordionRow({
  children,
  className,
  columns,
  ...props
}: RowProps) {
  const TableAccordionColumns = [...columns, '32px']

  return (
    <Accordion.Trigger tabIndex={-1}>
      <Table.Row
        columns={TableAccordionColumns}
        className={twMerge('group-aria-expanded:bg-slate-100', className)}
        clickable
        {...props}
      >
        {children}
        <RxCaretDown
          size={24}
          className="flex h-full items-center justify-center justify-self-end transition duration-300 group-aria-expanded:rotate-180"
        />
      </Table.Row>
    </Accordion.Trigger>
  )
}
