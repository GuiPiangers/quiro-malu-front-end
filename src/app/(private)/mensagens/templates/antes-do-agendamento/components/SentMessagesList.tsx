import Link from 'next/link'
import { MessageSquare } from 'lucide-react'
import type {
  WhatsAppMessageLogDTO,
  WhatsAppMessageLogStatus,
} from '@/services/message/messageLogs'
import { WhatsAppMessageBubble } from '@/components/message/WhatsAppMessageBubble'
import Phone from '@/utils/Phone'

const STATUS_LABEL: Record<WhatsAppMessageLogStatus, string> = {
  PENDING: 'Pendente',
  SENT: 'Enviada',
  DELIVERED: 'Entregue',
  READ: 'Lida',
  FAILED: 'Falhou',
}

function statusBadgeClass(status: WhatsAppMessageLogStatus): string {
  switch (status) {
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-900'
    case 'SENT':
      return 'bg-green-100 text-green-800'
    case 'DELIVERED':
      return 'bg-emerald-100 text-emerald-900'
    case 'READ':
      return 'bg-teal-100 text-teal-900'
    case 'FAILED':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-slate-100 text-slate-600'
  }
}

function formatPhone(value: string): string {
  if (!value?.trim()) return '—'
  const digits = Phone.unformat(value)
  if (!digits) return value
  return Phone.internationalFormat(value)
}

function formatSentAt(iso: string | null): string {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(d)
}

/** Horário no estilo bolha WhatsApp (ex.: 14:30). */
function formatMessageClock(iso: string | null): string | undefined {
  if (!iso) return undefined
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return undefined
  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}

type SentMessagesListProps = {
  campaignId: string
  logs: WhatsAppMessageLogDTO[]
  total: number
  page: number
  limit: number
  patientNames: Record<string, string>
  fetchError?: boolean
}

export default function SentMessagesList({
  campaignId,
  logs,
  total,
  page,
  limit,
  patientNames,
  fetchError,
}: SentMessagesListProps) {
  if (fetchError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-6 text-center text-sm text-red-800">
        Não foi possível carregar o histórico de mensagens. Tente novamente mais
        tarde.
      </div>
    )
  }

  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-slate-200 bg-white py-16 text-center shadow-sm">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-purple-50">
          <MessageSquare className="h-7 w-7 text-main" />
        </div>
        <div>
          <p className="font-medium text-slate-700">
            Nenhuma mensagem enviada ainda
          </p>
          <p className="mt-1 text-sm text-slate-500">
            As mensagens disparadas por esta campanha aparecerão aqui.
          </p>
        </div>
      </div>
    )
  }

  const totalPages = Math.max(1, Math.ceil(total / limit))
  const baseQuery = `aba=mensagens-enviadas`

  return (
    <div className="flex flex-col gap-4">
      {logs.map((log) => {
        const patientName =
          patientNames[log.patientId] ??
          `Paciente ${log.patientId.slice(0, 8)}…`

        return (
          <div
            key={log.id}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 flex-1 space-y-1">
                <p className="font-medium text-slate-800">{patientName}</p>
                <p className="text-sm text-slate-600">
                  <span className="text-slate-500">Para: </span>
                  <span className="font-mono">{formatPhone(log.toPhone)}</span>
                </p>
                <p className="text-xs text-slate-400">
                  Enviado em: {formatSentAt(log.sentAt)}
                </p>
              </div>
              <span
                className={`shrink-0 self-start rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadgeClass(
                  log.status,
                )}`}
              >
                {STATUS_LABEL[log.status]}
              </span>
            </div>

            {log.status === 'FAILED' && log.errorMessage ? (
              <p className="mt-3 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-800">
                {log.errorMessage}
              </p>
            ) : null}

            <details className="group mt-4 rounded-lg border border-slate-100 bg-slate-50">
              <summary className="cursor-pointer select-none px-3 py-2 text-xs font-medium text-main hover:bg-slate-100">
                Prévia da mensagem
              </summary>
              <div className="border-t border-slate-100 px-3 py-3">
                <WhatsAppMessageBubble
                  text={log.message}
                  timestamp={formatMessageClock(log.sentAt)}
                  emptyPlaceholder="Sem conteúdo de mensagem."
                />
              </div>
            </details>
          </div>
        )
      })}

      {totalPages > 1 ? (
        <div className="flex flex-wrap items-center justify-center gap-2 border-t border-slate-100 pt-4 text-sm text-slate-600">
          {page > 1 ? (
            <Link
              href={`/mensagens/templates/antes-do-agendamento/${campaignId}?${baseQuery}&page=${
                page - 1
              }`}
              className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-main hover:bg-purple-50"
            >
              Anterior
            </Link>
          ) : (
            <span className="px-3 py-1.5 text-slate-400">Anterior</span>
          )}
          <span>
            Página {page} de {totalPages}
          </span>
          {page < totalPages ? (
            <Link
              href={`/mensagens/templates/antes-do-agendamento/${campaignId}?${baseQuery}&page=${
                page + 1
              }`}
              className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-main hover:bg-purple-50"
            >
              Próxima
            </Link>
          ) : (
            <span className="px-3 py-1.5 text-slate-400">Próxima</span>
          )}
        </div>
      ) : null}
    </div>
  )
}
