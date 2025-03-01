import Button from '@/components/Button'
import {
  NotificationAction,
  NotificationActions,
  NotificationBaseItem,
  NotificationItemProps,
} from './NotificationItem'
import Link from 'next/link'
import Phone from '@/utils/Phone'
import { setActionDoneNotification } from '@/services/notification/notification'

type generateNotificationItemProps = Omit<NotificationItemProps, 'actions'> & {
  id: string
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
  id,
}: generateNotificationItemProps) {
  const actionData = actions?.sendMessage
  console.log(id)

  if (actionData) {
    const { params } = actionData
    const codeMessage = encodeURIComponent(params.templateMessage)
    return (
      <NotificationBaseItem
        id={id}
        notRead={notRead}
        actionNeeded={actionNeeded}
        message={message}
        title={title}
        actions={
          <NotificationActions>
            {actionNeeded ? (
              <Button disabled={!actionNeeded} size="small" asChild>
                <Link
                  onClick={async () => {
                    await setActionDoneNotification({ id })
                  }}
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
