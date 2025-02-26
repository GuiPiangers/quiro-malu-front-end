import { ReactNode } from 'react'
import { Table } from '../table'
import { Checkbox } from '../ui/checkbox'
import { twMerge } from 'tailwind-merge'
import { tv } from 'tailwind-variants'
import Button from '../Button'

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
  readonly action: actionFunction<T>
  readonly params: T

  constructor({ action, params }: { action: actionFunction<T>; params: T }) {
    this.action = action
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

type NotificationItemProps = {
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

type generateNOtificationIconProps = Omit<NotificationItemProps, 'actions'> & {
  actions?: { [key: string]: NotificationAction<any> }
}

function generateNOtificationIcon({
  message,
  title,
  actionNeeded,
  actions,
  notRead,
  type,
}: generateNOtificationIconProps) {
  const callAction = (key: string) => {
    const actionData = actions ? actions[key] : undefined
    if (actionData) {
      const { action, params } = actionData

      action(params)
    }
  }

  const notificationHashType: Record<string, JSX.Element> = {
    sendMessage: (
      <NotificationBaseItem
        notRead={notRead}
        actionNeeded={actionNeeded}
        message={message}
        title={title}
        actions={
          <NotificationActions>
            <Button
              disabled={!actionNeeded}
              size="small"
              onClick={() => {
                callAction('sendMessage')
              }}
            >
              Enviar mensagem
            </Button>
          </NotificationActions>
        }
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

export function NotificationItem(data: generateNOtificationIconProps) {
  return generateNOtificationIcon(data)
}
