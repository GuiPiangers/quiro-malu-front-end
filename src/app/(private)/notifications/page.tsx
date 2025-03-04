import { Box } from '@/components/box/Box'
import NotificationTable from '@/components/notification/notificationTable/NotificationTable'
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
        {notifications && (
          <NotificationTable notifications={notifications}></NotificationTable>
        )}
      </Table.Root>
    </Box>
  )
}
