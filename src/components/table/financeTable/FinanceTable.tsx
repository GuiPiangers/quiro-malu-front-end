import { Box } from '@/components/box/Box'
import NewFinanceModal from '@/components/modal/FinanceModal/NewFinanceModal'
import { Table } from '@/components/table'
import { FinanceListResponse } from '@/services/finance/Finance'
import { financePaymentMethod } from '@/services/finance/FinancePaymentMethod'
import { Currency } from '@/utils/Currency'
import DateTime from '@/utils/Date'
import { tableStyles } from '../Style'

export default function FinanceTable({
  financeList,
}: {
  financeList?: FinanceListResponse
}) {
  const { TrowStyle } = tableStyles()

  return (
    <Box>
      <Table.Root>
        <Table.Row columns={['16px', '1fr', '2fr', '1fr', '1fr']}>
          <Table.Head></Table.Head>
          <Table.Head>Data</Table.Head>
          <Table.Head>Descrição</Table.Head>
          <Table.Head>Valor</Table.Head>
          <Table.Head>Forma de pagamento</Table.Head>
        </Table.Row>

        {financeList?.map((finance) => (
          <NewFinanceModal asChild key={finance.id} formData={finance}>
            <Table.Row
              columns={['16px', '1fr', '2fr', '1fr', '1fr']}
              clickable
              className={TrowStyle({
                className: 'text-black ',
              })}
            >
              <Table.Cell
                className={`h-4 w-4 rounded ${
                  finance.type === 'income' ? 'bg-green-600' : 'bg-red-600'
                }`}
              ></Table.Cell>
              <Table.Cell>
                {DateTime.getLocaleDate(finance.date)}
                {' ('}
                {DateTime.getTime(finance.date)}
                {')'}
              </Table.Cell>
              <Table.Cell>{finance.description}</Table.Cell>
              <Table.Cell
                className={
                  finance.type === 'income' ? 'text-green-700' : 'text-red-700'
                }
              >
                R$ {finance.type === 'income' ? '' : '-'}{' '}
                {Currency.format(finance.value)}
              </Table.Cell>
              <Table.Cell>
                {
                  financePaymentMethod[
                    finance.paymentMethod as keyof typeof financePaymentMethod
                  ]
                }
              </Table.Cell>
            </Table.Row>
          </NewFinanceModal>
        ))}
      </Table.Root>
    </Box>
  )
}
