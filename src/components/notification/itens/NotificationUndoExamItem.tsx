import Button from '@/components/Button'
import {
  NotificationAction,
  NotificationActions,
  NotificationBaseItem,
  NotificationItemProps,
} from './NotificationItem'
import { restoreExam } from '@/services/exam/exam'
import useSnackbarContext from '@/hooks/useSnackbarContext'
import { deleteManyNotifications } from '@/services/notification/notification'

type generateNotificationItemProps = Omit<NotificationItemProps, 'actions'> & {
  id: string
  actions?: {
    undoExam: NotificationAction<{
      id: string
      patientId: string
    }>
  }
}

export function NotificationUndoExamItem(props: generateNotificationItemProps) {
  const actionData = props.actions?.undoExam
  const { handleMessage } = useSnackbarContext()

  if (actionData) {
    const { params } = actionData
    return (
      <NotificationBaseItem
        {...props}
        actions={
          <NotificationActions>
            <Button
              size="small"
              color="black"
              onClick={async () => {
                await restoreExam({
                  id: params.id,
                  patientId: params.patientId,
                })

                handleMessage({
                  type: 'success',
                  title: 'Exame restaurado com sucesso!',
                })

                await deleteManyNotifications({ notificationsId: [props.id] })
              }}
            >
              Restaurar exame
            </Button>
          </NotificationActions>
        }
      />
    )
  }
}
