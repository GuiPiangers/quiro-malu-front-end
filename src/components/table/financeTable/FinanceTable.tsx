import { Box } from '@/components/box/Box'
import { Table } from '@/components/table'
import { FinanceListResponse } from '@/services/finance/Finance'
import { Currency } from '@/utils/Currency'
import DateTime from '@/utils/Date'

export default function FinanceTable({
  financeList,
}: {
  financeList?: FinanceListResponse
}) {
  console.log(financeList)
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
        {financeList?.map((finance) => (
          <Table.Row
            key={finance.id}
            columns={['1fr', '2fr', '1fr', '1fr', '1fr']}
          >
            <Table.Cell>
              {DateTime.getLocaleDate(finance.date)}
              {' ('}
              {DateTime.getTime(finance.date)}
              {')'}
            </Table.Cell>
            <Table.Cell>{finance.description}</Table.Cell>
            <Table.Cell>R$ {Currency.format(finance.value)}</Table.Cell>
            <Table.Cell>{finance.type}</Table.Cell>
            <Table.Cell>{finance.paymentMethod}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Root>
    </Box>
  )
}
