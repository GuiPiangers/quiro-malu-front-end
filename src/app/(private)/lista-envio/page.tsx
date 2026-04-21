import Link from 'next/link'
import { Box } from '@/components/box/Box'
import Button from '@/components/Button'
import { Validate } from '@/services/api/Validate'
import { listMessageSendStrategies } from '@/services/message/sendList'
import SendListContent from './components/SendListContent'

export default async function ListaEnvioPage() {
  const res = await listMessageSendStrategies({ page: 1, limit: 100 })
  const initialData = Validate.isOk(res) ? res : undefined
  const total = initialData?.total ?? 0
  const totalLabel = `${total} ${total === 1 ? 'registro' : 'registros'}`

  return (
    <div className="w-full max-w-screen-lg space-y-6 text-slate-600">
      <Box className="w-full">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-semibold text-main">
              Listas cadastradas
            </h3>
            <span className="text-xs text-slate-500">{totalLabel}</span>
          </div>
          <Button
            asChild
            color="green"
            variant="solid"
            className="w-full sm:w-auto"
          >
            <Link href="/lista-envio/cadastro">Adicionar</Link>
          </Button>
        </div>
        <SendListContent initialData={initialData} />
      </Box>
    </div>
  )
}
