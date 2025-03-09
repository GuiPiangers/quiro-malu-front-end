import { ListMessageResponse } from '@/services/message/message'
import { Table } from '../table'

type MessageTableProps = {
  messageCampaignsData?: ListMessageResponse
}

export default function MessageTable({
  messageCampaignsData,
}: MessageTableProps) {
  const { messageCampaigns } = messageCampaignsData ?? {}
  return (
    <Table.Root>
      <Table.Row columns={['1fr', 'auto']}>
        <Table.Head>Nome</Table.Head>
        <Table.Head>Status</Table.Head>
      </Table.Row>
      {messageCampaigns &&
        messageCampaigns.map(({ active, name, id }) => (
          <Table.Row columns={['1fr', 'auto']} key={id}>
            <Table.Cell>{name}</Table.Cell>

            <Table.Cell>{active ? 'Ativo' : 'Inativo'}</Table.Cell>
          </Table.Row>
        ))}
    </Table.Root>
  )
}
