import { Validate } from '@/services/api/Validate'
import { listMessageSendStrategies } from '@/services/message/sendList'
import ListaEnvioContent from './components/SendListContent'

export default async function ListaEnvioPage() {
  const res = await listMessageSendStrategies({ page: 1, limit: 100 })
  const initialData = Validate.isOk(res) ? res : undefined

  return (
    <div className="w-full max-w-screen-lg space-y-6 text-slate-600">
      <ListaEnvioContent initialData={initialData} />
    </div>
  )
}
