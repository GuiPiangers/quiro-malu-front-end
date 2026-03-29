'use client'

import { MessageSquare } from 'lucide-react'
import { ListBeforeScheduleMessagesResponse } from '@/services/message/message'

type SentMessagesListProps = {
  data?: ListBeforeScheduleMessagesResponse
}

export default function SentMessagesList({ data }: SentMessagesListProps) {
  const messages = data?.beforeScheduleMessages ?? []

  if (messages.length === 0) {
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
            As mensagens enviadas por este template aparecerão aqui.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {messages.map((msg, index) => (
        <div
          key={msg.id ?? index}
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-medium text-slate-800">{msg.name}</p>
              <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                {msg.templateMessage}
              </p>
            </div>
            <span
              className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                msg.active
                  ? 'bg-green-100 text-green-700'
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              {msg.active ? 'Ativo' : 'Inativo'}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
