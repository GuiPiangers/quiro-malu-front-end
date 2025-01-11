import { Box } from '@/components/box/Box'
import { Table } from '@/components/table'

export default function FinanceTable() {
  return (
    <Box>
      <Table.Root>
        <Table.Row columns={['1fr', '2fr', '1fr', '1fr', '1fr']}>
          <Table.Head>Data</Table.Head>
          <Table.Head>Descrição</Table.Head>
          <Table.Head>Valor</Table.Head>
          <Table.Head>Tipo</Table.Head>
          <Table.Head>Forma de pagamento</Table.Head>
        </Table.Row>
        <Table.Row columns={['1fr', '2fr', '1fr', '1fr', '1fr']}>
          <Table.Cell>Tipo</Table.Cell>
          <Table.Cell>Forma de pagamento</Table.Cell>
          <Table.Cell>Paciente</Table.Cell>
          <Table.Cell>Paciente</Table.Cell>
          <Table.Cell>Paciente</Table.Cell>
        </Table.Row>
      </Table.Root>
    </Box>
  )
}
