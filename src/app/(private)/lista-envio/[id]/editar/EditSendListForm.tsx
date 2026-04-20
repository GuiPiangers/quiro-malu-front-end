'use client'

import { useMemo, useState } from 'react'
import { Box } from '@/components/box/Box'
import type { ListedMessageSendStrategyDTO } from '@/services/message/sendListTypes'
import SendMostRecentPatientsForm from '../../cadastro/components/SendMostRecentPatientsForm'
import {
  MESSAGE_SEND_STRATEGY_KIND_LABELS,
  MESSAGE_SEND_STRATEGY_KINDS,
  type MessageSendStrategyKind,
} from '../../kinds'

function amountFromParams(params: Record<string, unknown>) {
  const v = params.amount
  if (typeof v === 'number' && Number.isFinite(v)) return String(v)
  if (typeof v === 'string' && v !== '') return v
  return '0'
}

function labelForKind(kind: string) {
  const label =
    MESSAGE_SEND_STRATEGY_KIND_LABELS[kind as MessageSendStrategyKind]
  return label ?? kind
}

type EditSendListFormProps = {
  strategy: ListedMessageSendStrategyDTO
}

export default function EditSendListForm({ strategy }: EditSendListFormProps) {
  const [kind, setKind] = useState(strategy.kind)

  const kindOptions = useMemo(() => {
    const base: string[] = [...MESSAGE_SEND_STRATEGY_KINDS]
    if (!base.includes(strategy.kind)) {
      base.unshift(strategy.kind)
    }
    return base
  }, [strategy.kind])

  return (
    <div className="space-y-8">
      <Box>
        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-800">
            1. Tipo de lista
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {kindOptions.map((k) => {
              const selected = kind === k
              const implemented = k === 'send_most_recent_patients'
              return (
                <button
                  key={k}
                  type="button"
                  onClick={() => setKind(k)}
                  className={`rounded-lg border px-4 py-3 text-left text-sm transition ${
                    selected
                      ? 'border-main bg-purple-50 text-slate-900 ring-2 ring-main/30'
                      : 'border-slate-200 bg-white text-slate-800 hover:border-main/50 hover:bg-slate-50'
                  }`}
                >
                  <span className="font-medium">{labelForKind(k)}</span>
                  {!implemented ? (
                    <span className="mt-1 block text-xs text-slate-500">
                      Formulário em breve
                    </span>
                  ) : null}
                </button>
              )
            })}
          </div>
        </section>
      </Box>

      <Box>
        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-800">
            2. Dados da lista
          </h3>
          {kind === 'send_most_recent_patients' ? (
            <div>
              <p className="text-sm text-slate-600">
                Lista com base nos pacientes com consulta mais recente. Defina
                quantos pacientes deseja incluir a partir do mais recente.
              </p>
              <SendMostRecentPatientsForm
                key={`${strategy.id}-${kind}`}
                mode="edit"
                strategyId={strategy.id}
                kind={kind}
                defaultName={strategy.name}
                defaultAmount={amountFromParams(strategy.params)}
              />
            </div>
          ) : (
            <p className="text-sm text-slate-600">
              O formulário de cadastro para este tipo ainda não está disponível.
              Escolha &quot;Pacientes mais Recentes&quot; ou volte mais tarde.
            </p>
          )}
        </section>
      </Box>
    </div>
  )
}
