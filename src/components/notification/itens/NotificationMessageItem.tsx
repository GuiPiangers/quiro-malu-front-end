import Button from '@/components/Button'
import {
  NotificationAction,
  NotificationActions,
  NotificationBaseItem,
  NotificationItemProps,
} from './NotificationItem'
import Link from 'next/link'
import Phone from '@/utils/Phone'

type generateNotificationIconProps = Omit<NotificationItemProps, 'actions'> & {
  actions?: {
    sendMessage: NotificationAction<{
      templateMessage: string
      patientPhone: string
    }>
  }
}

export function NotificationMessageItem({
  message,
  title,
  actionNeeded,
  actions,
  notRead,
  type,
}: generateNotificationIconProps) {
  const actionData = actions?.sendMessage

  if (actionData) {
    const { params } = actionData
    const codeMessage = encodeURIComponent(params.templateMessage)
    return (
      <NotificationBaseItem
        notRead={notRead}
        actionNeeded={actionNeeded}
        message={message}
        title={title}
        actions={
          <NotificationActions>
            {actionNeeded ? (
              <Button disabled={!actionNeeded} size="small" asChild>
                <Link
                  target="_blank"
                  href={`https://wa.me/55${Phone.unformat(
                    params.patientPhone,
                  )}?text=${codeMessage}`}
                >
                  Enviar mensagem
                </Link>
              </Button>
            ) : (
              <Button disabled={!actionNeeded} size="small">
                Enviar mensagem
              </Button>
            )}
          </NotificationActions>
        }
      />
    )
  }
}
