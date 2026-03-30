import Link from 'next/link'
import { Clock, ArrowLeft, MessageSquare, Settings } from 'lucide-react'
import { Validate } from '@/services/api/Validate'
import { getBeforeScheduleMessage } from '@/services/message/message'
import BeforeScheduleForm from '../components/BeforeScheduleForm'
import SentMessagesList from '../components/SentMessagesList'

type PageProps = {
  params: { id: string }
  searchParams: { aba?: string }
}

export default async function EditBeforeScheduleCampaignPage({
  params,
  searchParams,
}: PageProps) {
  const activeTab = searchParams.aba ?? 'configuracao'

  const messageData = await getBeforeScheduleMessage(params.id).then((res) =>
    Validate.isOk(res) ? res : undefined,
  )

  return (
    <div className="w-full max-w-screen-lg space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3">
        <Link
          href="/mensagens/templates/antes-do-agendamento"
          className="flex w-fit items-center gap-1.5 text-sm text-slate-500 transition hover:text-main"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Link>

        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50">
            <Clock className="h-5 w-5 text-main" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-main">
              {messageData?.name ?? 'Mensagem antes de agendamento'}
            </h1>
            <p className="text-sm text-slate-500">Editar campanha</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-slate-200">
        <Link
          href="?aba=configuracao"
          className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition ${
            activeTab === 'configuracao'
              ? 'border-main text-main'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Settings className="h-4 w-4" />
          Configuração
        </Link>
        <Link
          href="?aba=mensagens-enviadas"
          className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition ${
            activeTab === 'mensagens-enviadas'
              ? 'border-main text-main'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <MessageSquare className="h-4 w-4" />
          Mensagens Enviadas
        </Link>
      </div>

      {/* Tab content */}
      {activeTab === 'configuracao' ? (
        <BeforeScheduleForm defaultValues={messageData} />
      ) : (
        <SentMessagesList /> /* Pass fetching logic if available in the future */
      )}
    </div>
  )
}
