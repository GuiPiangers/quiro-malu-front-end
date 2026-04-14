import type { ComponentProps } from 'react'
import Link from 'next/link'
import { Clock, MessageSquare, Settings } from 'lucide-react'
import { Validate } from '@/services/api/Validate'
import { getBeforeScheduleMessage } from '@/services/message/message'
import { getMessageLogs } from '@/services/message/messageLogs'
import { getPatient } from '@/services/patient/patient'
import BeforeScheduleForm from '../components/BeforeScheduleForm'
import SentMessagesList from '../components/SentMessagesList'

type PageProps = {
  params: { id: string }
  searchParams: { aba?: string; page?: string }
}

async function patientNamesForLogs(
  patientIds: string[],
): Promise<Record<string, string>> {
  const unique = Array.from(new Set(patientIds))
  const map: Record<string, string> = {}
  await Promise.all(
    unique.map(async (id) => {
      const res = await getPatient(id)
      if (Validate.isOk(res) && res?.name) {
        map[id] = res.name
      }
    }),
  )
  return map
}

export default async function EditBeforeScheduleCampaignPage({
  params,
  searchParams,
}: PageProps) {
  const activeTab = searchParams.aba ?? 'configuracao'

  const messageData = await getBeforeScheduleMessage(params.id).then((res) =>
    Validate.isOk(res) ? res : undefined,
  )

  const logsPage = Math.max(1, parseInt(searchParams.page ?? '1', 10) || 1)
  const logsLimit = 20

  let sentLogsProps: ComponentProps<typeof SentMessagesList> | null = null

  if (activeTab === 'mensagens-enviadas') {
    const logsRes = await getMessageLogs({
      beforeScheduleMessageId: params.id,
      page: logsPage,
      limit: logsLimit,
    })

    if (Validate.isOk(logsRes) && 'items' in logsRes) {
      const items = logsRes.items ?? []
      const patientNames = await patientNamesForLogs(
        items.map((i) => i.patientId),
      )
      sentLogsProps = {
        campaignId: params.id,
        logs: items,
        total: logsRes.total ?? 0,
        page: logsRes.page ?? logsPage,
        limit: logsRes.limit ?? logsLimit,
        patientNames,
        fetchError: false,
      }
    } else {
      sentLogsProps = {
        campaignId: params.id,
        logs: [],
        total: 0,
        page: logsPage,
        limit: logsLimit,
        patientNames: {},
        fetchError: true,
      }
    }
  }

  return (
    <div className="w-full max-w-screen-lg space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3">
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
      ) : sentLogsProps ? (
        <SentMessagesList {...sentLogsProps} />
      ) : null}
    </div>
  )
}
