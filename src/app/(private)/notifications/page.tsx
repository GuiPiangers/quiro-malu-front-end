import { Box } from '@/components/box/Box'
import { NotificationItem } from '@/components/notification/itens/NotificationItem'
import { Table } from '@/components/table'
import { Validate } from '@/services/api/Validate'
import { listNotifications } from '@/services/notification/notification'

export default async function NotificationPage() {
  const notifications = await listNotifications().then((res) =>
    Validate.isOk(res) ? res : undefined,
  )
  return (
    <Box className="w-full max-w-screen-lg">
      <Table.Root>
        {notifications?.length === 0 && (
          <span>Você não tem nenhuma notificação!</span>
        )}
        {notifications?.map(
          ({ message, read, title, type, actionNeeded, id }) => (
            <NotificationItem
              type={type}
              key={id}
              notRead={read}
              actionNeeded={actionNeeded}
              message={message}
              title={title}
            />
          ),
        )}
      </Table.Root>
    </Box>
  )
}
