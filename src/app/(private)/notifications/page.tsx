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
    <Box>
      <Table.Root>
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
