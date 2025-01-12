import { Box } from '@/components/box/Box'
import Button from '@/components/Button'
import NewFinanceModal from '@/components/modal/newFinanceModal/NewFinanceModal'
import { Nav } from '@/components/navigation'
import ResultCard from '@/components/ResultCard'
import RouteReplace from '@/components/RouteReplace'
import FinanceTable from '@/components/table/financeTable/FinanceTable'
import { Validate } from '@/services/api/Validate'
import { listFinances } from '@/services/finance/Finance'
import DateTime from '@/utils/Date'
import { RxCaretDown } from 'react-icons/rx'

export default async function Finance({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined }
}) {
  const date = searchParams.date
    ? searchParams.date
    : DateTime.getIsoDate(new Date())

  const incMonth = (month: number) =>
    `?date=${DateTime.getIsoDate(
      new Date(+date.substring(0, 4), +date.substring(5, 7) - 1 + month),
    )}`

  const financeList = await listFinances()

  const income = Validate.isOk(financeList)
    ? financeList.reduce((acc, finance) => {
        if (finance.type === 'income') {
          return acc + finance.value
        }
        return acc
      }, 0)
    : 0

  const expense = Validate.isOk(financeList)
    ? financeList.reduce((acc, finance) => {
        if (finance.type === 'expense') {
          return acc + finance.value
        }
        return acc
      }, 0)
    : 0

  const total = income - expense

  return (
    <section className="flex flex-col gap-4">
      <Nav.root>
        <Nav.item href="/finance">Fluxo de caixa</Nav.item>
        <Nav.item href="/finance/relatorio">Relatório</Nav.item>
      </Nav.root>

      <Box>
        <div className="flex gap-1">
          <RouteReplace route={incMonth(-1)}>
            <RxCaretDown
              size={24}
              className="rotate-90 cursor-pointer rounded text-main hover:bg-slate-100"
            />
          </RouteReplace>
          <span className="text-lg font-semibold text-main">
            {DateTime.getLocaleMonth(date)} de {new Date(date).getFullYear()}
          </span>
          <RouteReplace route={incMonth(1)}>
            <RxCaretDown
              size={24}
              className="-rotate-90 cursor-pointer rounded text-main hover:bg-slate-100"
            />
          </RouteReplace>
        </div>
      </Box>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <ResultCard
          title="Total"
          value={total}
          className="col-span-2 bg-blue-600 sm:col-span-1"
        />
        <ResultCard title="Receitas" value={income} className="bg-green-600" />
        <ResultCard title="Despesas" value={expense} className="bg-red-600" />
      </div>

      <Box>
        <NewFinanceModal>Novo registro</NewFinanceModal>
      </Box>

      <FinanceTable
        financeList={Validate.isOk(financeList) ? financeList : undefined}
      />
    </section>
  )
}
