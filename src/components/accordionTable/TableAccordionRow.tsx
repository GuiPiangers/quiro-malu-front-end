import { HTMLAttributes } from 'react'
import { RxCaretDown } from 'react-icons/rx'
import { Accordion } from '../accordion'
import { Table } from '../table'
import { twMerge } from 'tailwind-merge'

type RowProps = {
  columns: string[]
  showExpandIcon?: boolean
} & HTMLAttributes<HTMLDivElement>

export default function TableAccordionRow({
  children,
  className,
  columns,
  showExpandIcon = true,
  ...props
}: RowProps) {
  const TableAccordionColumns = showExpandIcon
    ? [...columns, '32px']
    : [...columns]

  return (
    <Accordion.Trigger tabIndex={-1}>
      <Table.Row
        columns={TableAccordionColumns}
        className={twMerge('group-aria-expanded:bg-slate-100', className)}
        clickable
        {...props}
      >
        {children}
        {showExpandIcon ? (
          <RxCaretDown
            size={24}
            className="flex h-full items-center justify-center justify-self-end transition duration-300 group-aria-expanded:rotate-180"
          />
        ) : null}
      </Table.Row>
    </Accordion.Trigger>
  )
}
