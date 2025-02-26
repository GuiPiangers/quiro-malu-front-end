import { ReactNode } from 'react'
import { Table } from '../../table'
import { Checkbox } from '../../ui/checkbox'
import { twMerge } from 'tailwind-merge'
import { tv } from 'tailwind-variants'
import Button from '../../Button'
import Link from 'next/link'
import { NotificationMessageItem } from './NotificationMessageItem'

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
  title: string
  message: string
  type?: string
  actions?: React.ReactElement<typeof NotificationActions>
  notRead?: boolean
  actionNeeded?: boolean
}

export function NotificationBaseItem({
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

type generateNotificationIconProps = Omit<NotificationItemProps, 'actions'>
function generateNotificationIcon({
  message,
  title,
  actionNeeded,
  notRead,
  type,
}: generateNotificationIconProps) {
  // const callAction = (key: string) => {
  //   const actionData = actions ? actions[key] : undefined
  //   if (actionData) {
  //     const { action, params } = actionData

  //     action(params)
  //   }
  // }
  // const {params} = actions ? actions[key] : {}

  const notificationHashType: Record<string, JSX.Element> = {
    sendMessage: (
      <NotificationMessageItem
        notRead={notRead}
        actionNeeded={actionNeeded}
        message={message}
        title={title}
        actions={{
          sendMessage: {
            params: {
              patientPhone: '(51) 98035 1927',
              templateMessage:
                'Olá, você está recebendo essa mensagem de teste! *Testanto texto negrito* \ntestanto espaços em branco asd testando nova linha!',
            },
          },
        }}
      />
    ),
  }

  const result = notificationHashType[type ?? 'default'] ?? (
    <NotificationBaseItem
      notRead={notRead}
      actionNeeded={actionNeeded}
      message={message}
      title={title}
    />
  )

  return result
}

export function NotificationItem(data: generateNotificationIconProps) {
  return generateNotificationIcon(data)
}
