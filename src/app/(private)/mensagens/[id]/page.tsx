import { Box } from '@/components/box/Box'
import { Table } from '@/components/table'

export type ParamsType = { id: string }

export default function messageCampaignPage({
  params,
}: {
  params: ParamsType
}) {
  const id = params.id
  return (
    <Box className="w-full max-w-lg">
      <Table.Root>
        <Table.Row columns={['1fr', '1fr']}>
          <Table.Head></Table.Head>
        </Table.Row>
      </Table.Root>
    </Box>
  )
}
