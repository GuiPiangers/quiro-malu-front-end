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

export function NotificationMessageItem(props: generateNotificationItemProps) {
  const actionData = props.actions?.sendMessage

  if (actionData) {
    const { params } = actionData
    const codeMessage = encodeURIComponent(params.templateMessage)
    return (
      <NotificationBaseItem
        {...props}
        actions={
          <NotificationActions>
            {props.actionNeeded ? (
              <Button disabled={!props.actionNeeded} size="small" asChild>
                <Link
                  onClick={async () => {
                    await setActionDoneNotification({ id: props.id })
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
              <Button disabled={!props.actionNeeded} size="small">
                Enviar mensagem
              </Button>
            )}
          </NotificationActions>
        }
      />
    )
  }
}
