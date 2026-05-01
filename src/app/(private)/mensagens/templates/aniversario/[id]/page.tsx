import type { ComponentProps } from 'react'
import Link from 'next/link'
import { Cake, MessageSquare, Settings } from 'lucide-react'
import { Validate } from '@/services/api/Validate'
import { getBirthdayMessage } from '@/services/message/birthdayMessage'
import { mapBirthdayDtoToResponse } from '@/services/message/birthdayMessageMapper'
import { getMessageLogs } from '@/services/message/messageLogs'
import { getPatient } from '@/services/patient/patient'
import BirthdayMessageForm from '../components/BirthdayMessageForm'
import type { SendListSelection } from '@/app/(private)/mensagens/components/MessageTemplateSendListPicker'
import SentMessagesList from '../../antes-do-agendamento/components/SentMessagesList'

type PageProps = {
  params: { id: string }
  searchParams: { aba?: string; page?: string }
}

const LIST_BASE = '/mensagens/templates/aniversario'

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

export default async function EditBirthdayCampaignPage({
  params,
  searchParams,
}: PageProps) {
  const activeTab = searchParams.aba ?? 'configuracao'

  const messageDto = await getBirthdayMessage(params.id).then((res) =>
    Validate.isOk(res) ? res : undefined,
  )
  const messageData = messageDto
    ? mapBirthdayDtoToResponse(messageDto)
    : undefined
  const initialLinkedSendStrategies: SendListSelection[] =
    messageDto?.linkedMessageSendStrategies?.map((s) => ({
      id: s.id,
      name: s.name,
    })) ?? []

  const logsPage = Math.max(1, parseInt(searchParams.page ?? '1', 10) || 1)
  const logsLimit = 20

  let sentLogsProps: ComponentProps<typeof SentMessagesList> | null = null

  if (activeTab === 'mensagens-enviadas') {
    const logsRes = await getMessageLogs({
      scheduleMessageConfigId: params.id,
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
        listBasePath: LIST_BASE,
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
        listBasePath: LIST_BASE,
      }
    }
  }

  return (
    <div className="w-full max-w-screen-lg space-y-6">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50">
            <Cake className="h-5 w-5 text-main" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-main">
              {messageData?.name ?? 'Mensagem de aniversário'}
            </h1>
            <p className="text-sm text-slate-500">Editar campanha</p>
          </div>
        </div>
      </div>

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

      {activeTab === 'configuracao' ? (
        <BirthdayMessageForm
          defaultValues={messageData}
          initialLinkedSendStrategies={initialLinkedSendStrategies}
        />
      ) : sentLogsProps ? (
        <SentMessagesList {...sentLogsProps} />
      ) : null}
    </div>
  )
}
