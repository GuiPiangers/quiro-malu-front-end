import { ReactNode } from 'react'
import { Table } from '../table'
import { Checkbox } from '../ui/checkbox'
import { twMerge } from 'tailwind-merge'
import { tv } from 'tailwind-variants'

export const NotificationItemStyle = tv({
  variants: {
    notRead: {
      false: 'bg-white',
      true: 'bg-slate-100',
    },
    action: {
      true: 'bg-blue-100',
    },
  },
  defaultVariants: {
    notRead: false,
    action: false,
  },
  compoundVariants: [
    {
      notRead: true,
      action: true,
      className: 'bg-blue-100',
    },
  ],
})

export function NotificationActions({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <Table.Cell className={twMerge('col-span-3 flex gap-2', className)}>
      {children}
    </Table.Cell>
  )
}

type NotificationItemProps = {
  title: string
  message: string
  type?: string
  actions?: React.ReactElement<typeof NotificationActions>
  notRead?: boolean
  actionNeeded?: boolean
}

export default function NotificationItem({
  message,
  title,
  actions,
  notRead,
  type,
  actionNeeded,
}: NotificationItemProps) {
  const style = NotificationItemStyle({ action: actionNeeded, notRead })

  return (
    <Table.Row columns={['auto', '1fr', '2fr', 'auto']} className={style}>
      <Table.Cell>
        <Checkbox className="border-blue-500 data-[state=checked]:bg-blue-500" />
      </Table.Cell>
      <Table.Cell>{title}</Table.Cell>
      <Table.Cell>{message}</Table.Cell>
      <Table.Cell className="w-full text-end">21 de Fev.</Table.Cell>
      {actions}
      {actionNeeded && actions ? (
        <span className="whitespace-nowrap rounded bg-white p-1 text-end text-xs font-bold text-blue-800">
          Ação necessária
        </span>
      ) : (
        actions && (
          <span className="whitespace-nowrap rounded bg-white p-1 text-end text-xs font-bold text-slate-600">
            Ação realizada
          </span>
        )
      )}
    </Table.Row>
  )
}
