import { Box } from '@/components/box/Box'
import Button from '@/components/Button'
import NotificationItem, {
  NotificationActions,
} from '@/components/notification/notificationItem'
import { Table } from '@/components/table'

export default function NotificationPage() {
  return (
    <Box>
      <Table.Root>
        {[10, 20, 1, 10, 1, 1, 20, 0, 0, 0].map((value, index) => (
          <NotificationItem
            key={index}
            notRead={value === 1 || value === 10}
            actionNeeded={value === 20}
            message="Texto exepmplo de mensagem que dewve ser notificada"
            title="A data de aniversário de Guilherme Eduardo Martins Piangers"
            actions={
              value === 10 || value === 20 ? (
                <NotificationActions>
                  <Button disabled={value === 10} size="small">
                    Enviar mensagem
                  </Button>
                </NotificationActions>
              ) : undefined
            }
          />
        ))}
      </Table.Root>
    </Box>
  )
}
