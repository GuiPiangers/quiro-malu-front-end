import ResultCard from '@/components/ResultCard'
import FinanceTable from '@/components/table/financeTable/FinanceTable'

export default function Finance() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <ResultCard
          title="Total"
          value={150.0}
          className="col-span-2 bg-blue-600 sm:col-span-1"
        />
        <ResultCard title="Receitas" value={15.566} className="bg-green-600" />
        <ResultCard title="Despesas" value={100} className="bg-red-600" />
      </div>

      <FinanceTable />
    </div>
  )
}
