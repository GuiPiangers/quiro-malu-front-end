import { ReactNode } from 'react'
import { Table } from '../../table'
import { Checkbox } from '../../ui/checkbox'
import { twMerge } from 'tailwind-merge'
import { tv } from 'tailwind-variants'
import { NotificationMessageItem } from './NotificationMessageItem'
import { notificationType } from '@/services/notification/notification'

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

type actionFunction<T> = (data: T) => void

export class NotificationAction<T> {
  readonly params: T

  constructor({ params }: { action: actionFunction<T>; params: T }) {
    this.params = params
  }
}

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

export type NotificationItemProps = {
  id: string
  title: string
  message: string
  type?: notificationType
  actions?: React.ReactElement<typeof NotificationActions>
  notRead?: boolean
  actionNeeded?: boolean
  params?: any
}

export function NotificationBaseItem({
  message,
  title,
  actions,
  notRead,
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

type generateNotificationItemProps = Omit<NotificationItemProps, 'actions'>
function generateNotificationItem({
  message,
  title,
  actionNeeded,
  notRead,
  type,
  params,
  id,
}: generateNotificationItemProps) {
  const notificationHashType: Record<notificationType, JSX.Element> = {
    sendMessage: (
      <NotificationMessageItem
        notRead={notRead}
        actionNeeded={actionNeeded}
        message={message}
        title={title}
        id={id}
        actions={{
          sendMessage: {
            params: {
              patientPhone:
                typeof params?.patientPhone === 'string'
                  ? params?.patientPhone
                  : '',
              templateMessage: params?.templateMessage,
            },
          },
        }}
      />
    ),
    default: <div></div>,
    undo: <div></div>,
  }

  const result = notificationHashType[type ?? 'default'] ?? (
    <NotificationBaseItem
      id={id}
      notRead={notRead}
      actionNeeded={actionNeeded}
      message={message}
      title={title}
    />
  )

  return result
}

export function NotificationItem(data: generateNotificationItemProps) {
  return generateNotificationItem(data)
}
