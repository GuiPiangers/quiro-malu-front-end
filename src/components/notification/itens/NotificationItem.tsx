import { ReactNode } from 'react'
import { Table } from '../../table'
import { Checkbox } from '../../ui/checkbox'
import { twMerge } from 'tailwind-merge'
import { tv } from 'tailwind-variants'
import { NotificationMessageItem } from './NotificationMessageItem'
import { notificationType } from '@/services/notification/notification'
import { CheckedState } from '@radix-ui/react-checkbox'
import useWindowSize from '@/hooks/useWindowSize'
import { NotificationUndoExamItem } from './NotificationUndoExamItem'
import DateTime from '@/utils/Date'

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
    <Table.Cell
      className={twMerge('col-span-2 flex gap-2 md:col-span-3', className)}
    >
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
  checked?: boolean
  createdAt?: string
  onCheckedChange?(checked: CheckedState): void
}

export function NotificationBaseItem({
  message,
  title,
  actions,
  notRead,
  actionNeeded,
  checked,
  onCheckedChange,
  createdAt,
}: NotificationItemProps) {
  const style = NotificationItemStyle({ action: actionNeeded, notRead })
  const { windowWidth } = useWindowSize()
  if (windowWidth > 768) {
    return (
      <Table.Row columns={['auto', '1fr', '2fr', 'auto']} className={style}>
        <Table.Cell>
          <Checkbox
            checked={checked}
            color="blue"
            onCheckedChange={(value) => {
              onCheckedChange && onCheckedChange(value)
            }}
          />
        </Table.Cell>
        <Table.Cell>{title}</Table.Cell>
        <Table.Cell>{message}</Table.Cell>
        <Table.Cell className="w-full text-end text-sm">
          {createdAt && DateTime.getLocaleDate(createdAt)}
        </Table.Cell>
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
  } else {
    return (
      <Table.Row columns={['auto', '1fr', 'auto']} className={style}>
        <Table.Cell>
          <Checkbox
            checked={checked}
            color="blue"
            onCheckedChange={(value) => {
              onCheckedChange && onCheckedChange(value)
            }}
          />
        </Table.Cell>
        <Table.Cell>{title}</Table.Cell>
        <Table.Cell className="w-full text-end text-sm">
          {createdAt && DateTime.getLocaleDate(createdAt)}
        </Table.Cell>
        <Table.Cell className="col-span-full">{message}</Table.Cell>

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
}

type generateNotificationItemProps = Omit<NotificationItemProps, 'actions'>
function generateNotificationItem({
  type,
  params,
  ...props
}: generateNotificationItemProps) {
  const notificationHashType: Record<notificationType, JSX.Element> = {
    sendMessage: (
      <NotificationMessageItem
        {...props}
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
    undoExam: (
      <NotificationUndoExamItem
        {...props}
        actions={{
          undoExam: {
            params: {
              patientId: params.patientId,
              id: params.id,
            },
          },
        }}
      />
    ),
    default: <NotificationBaseItem {...props} />,
  }

  const result = notificationHashType[type ?? 'default'] ?? (
    <NotificationBaseItem {...props} />
  )

  return result
}

export function NotificationItem(data: generateNotificationItemProps) {
  return generateNotificationItem(data)
}
