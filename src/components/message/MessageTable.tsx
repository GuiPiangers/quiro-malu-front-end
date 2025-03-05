import { Table } from '../table'

export default function MessageTable() {
  return (
    <Table.Root>
      <Table.Row columns={['1fr', '1fr', 'auto']}>
        <Table.Head>Nome</Table.Head>
        <Table.Head>Total enviado</Table.Head>
        <Table.Head>Status</Table.Head>
      </Table.Row>
      <Table.Row columns={['1fr', '1fr', 'auto']}>
        <Table.Cell>Nome</Table.Cell>
        <Table.Cell className="">100</Table.Cell>
        <Table.Cell>Ativo</Table.Cell>
      </Table.Row>
    </Table.Root>
  )
}
