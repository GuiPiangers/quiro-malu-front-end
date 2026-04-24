'use client'

import { useMemo, useState } from 'react'
import { Box } from '@/components/box/Box'
import type { ListedMessageSendStrategyDTO } from '@/services/message/sendListTypes'
import SendMostFrequencyPatientsForm from '../../cadastro/components/SendMostFrequencyPatientsForm'
import SendMostRecentPatientsForm from '../../cadastro/components/SendMostRecentPatientsForm'
import SendExcludePatientsListForm from '../../cadastro/components/SendExcludePatientsListForm'
import SendSelectedListForm, {
  type SelectedListPatientRow,
} from '../../cadastro/components/SendSelectedListForm'
import {
  MESSAGE_SEND_STRATEGY_KIND_LABELS,
  MESSAGE_SEND_STRATEGY_KINDS,
  type MessageSendStrategyKind,
} from '../../kinds'

function amountStringFromListedStrategy(
  strategy: ListedMessageSendStrategyDTO,
): string {
  if (
    strategy.kind === 'send_most_recent_patients' ||
    strategy.kind === 'send_most_frequency_patients'
  ) {
    const n = strategy.params.amount
    if (typeof n === 'number' && Number.isFinite(n)) return String(n)
    if (typeof n === 'string' && n !== '') return n
  }
  return '0'
}

function labelForKind(kind: string) {
  const label =
    MESSAGE_SEND_STRATEGY_KIND_LABELS[kind as MessageSendStrategyKind]
  return label ?? kind
}

function initialRowsPatientListKind(
  strategy: ListedMessageSendStrategyDTO,
  listKind: 'send_selected_list' | 'exclude_patients_list',
): SelectedListPatientRow[] {
  if (strategy.kind !== listKind) return []
  const ids = strategy.params.patientIdList ?? []
  const patients = strategy.patients ?? []
  return ids.map((id, i) => ({
    id,
    name: patients[i]?.name ?? '—',
    phone: patients[i]?.phone ?? '—',
  }))
}

const implementedEditKind = (
  k: MessageSendStrategyKind,
): k is
  | 'send_most_recent_patients'
  | 'send_most_frequency_patients'
  | 'send_selected_list'
  | 'exclude_patients_list' =>
  k === 'send_most_recent_patients' ||
  k === 'send_most_frequency_patients' ||
  k === 'send_selected_list' ||
  k === 'exclude_patients_list'

type EditSendListFormProps = {
  strategy: ListedMessageSendStrategyDTO
}

export default function EditSendListForm({ strategy }: EditSendListFormProps) {
  const [kind, setKind] = useState(strategy.kind)

  const kindOptions = useMemo((): MessageSendStrategyKind[] => {
    const base: MessageSendStrategyKind[] = [...MESSAGE_SEND_STRATEGY_KINDS]
    if (!base.includes(strategy.kind)) {
      base.unshift(strategy.kind)
    }
    return base
  }, [strategy.kind])

  return (
    <div className="space-y-8">
      <Box className="p-0">
        <section className="space-y-3 px-4 py-6">
          <h3 className="text-sm font-semibold text-slate-800">
            1. Tipo de lista
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {kindOptions.map((k) => {
              const selected = kind === k
              const implemented = implementedEditKind(k)
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

      <Box className="p-0">
        <section className="space-y-4 pb-6">
          <div className="space-y-3 px-4 pt-6">
            <h3 className="text-sm font-semibold text-slate-800">
              2. Dados da lista
            </h3>
            {kind === 'send_most_recent_patients' ? (
              <p className="text-sm text-slate-600">
                Lista com base nos pacientes com consulta mais recente. Defina
                quantos pacientes deseja incluir a partir do mais recente.
              </p>
            ) : null}
            {kind === 'send_most_frequency_patients' ? (
              <p className="text-sm text-slate-600">
                Lista com base nos pacientes com maior frequência de consultas.
                Defina quantos pacientes deseja incluir, ordenados por
                frequência.
              </p>
            ) : null}
            {kind === 'send_selected_list' ? (
              <p className="text-sm text-slate-600">
                Monte a lista escolhendo os pacientes que receberão o disparo.
                Busque por nome, adicione até 50 pacientes e remova quando
                precisar.
              </p>
            ) : null}
            {kind === 'exclude_patients_list' ? (
              <p className="text-sm text-slate-600">
                Defina quais pacientes <strong>não</strong> devem receber
                disparos automáticos quando esta lista de envio estiver
                vinculada a uma campanha.
              </p>
            ) : null}
            {!implementedEditKind(kind) ? (
              <p className="text-sm text-slate-600">
                O formulário de edição para este tipo ainda não está disponível.
                Escolha um tipo com formulário disponível ou volte mais tarde.
              </p>
            ) : null}
          </div>

          {kind === 'send_most_recent_patients' ? (
            <SendMostRecentPatientsForm
              key={`${strategy.id}-${kind}`}
              mode="edit"
              strategyId={strategy.id}
              kind={kind}
              defaultName={strategy.name}
              defaultAmount={amountStringFromListedStrategy(strategy)}
            />
          ) : null}
          {kind === 'send_most_frequency_patients' ? (
            <SendMostFrequencyPatientsForm
              key={`${strategy.id}-${kind}`}
              mode="edit"
              strategyId={strategy.id}
              defaultName={strategy.name}
              defaultAmount={amountStringFromListedStrategy(strategy)}
            />
          ) : null}
          {kind === 'send_selected_list' ? (
            <SendSelectedListForm
              key={`${strategy.id}-${kind}`}
              mode="edit"
              strategyId={strategy.id}
              defaultName={strategy.name}
              initialSelected={initialRowsPatientListKind(
                strategy,
                'send_selected_list',
              )}
            />
          ) : null}
          {kind === 'exclude_patients_list' ? (
            <SendExcludePatientsListForm
              key={`${strategy.id}-${kind}`}
              mode="edit"
              strategyId={strategy.id}
              defaultName={strategy.name}
              initialSelected={initialRowsPatientListKind(
                strategy,
                'exclude_patients_list',
              )}
            />
          ) : null}
        </section>
      </Box>
    </div>
  )
}
