import { Box } from '@/components/box/Box'
import { NotificationItem } from '@/components/notification/itens/NotificationItem'
import { Table } from '@/components/table'

export default function NotificationPage() {
  return (
    <Box>
      <Table.Root>
        {[10, 20, 1, 10, 1, 1, 20, 0, 0, 0].map((value, index) => (
          <NotificationItem
            type="sendMessage"
            key={index}
            notRead={value === 1 || value === 10}
            actionNeeded={value === 20}
            message="Texto exepmplo de mensagem que dewve ser notificada"
            title="A data de aniversário de Guilherme Eduardo Martins Piangers"
          />
        ))}
      </Table.Root>
    </Box>
  )
}
