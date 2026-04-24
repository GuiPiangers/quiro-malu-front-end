'use client'

import { useState } from 'react'
import { Box } from '@/components/box/Box'
import {
  MESSAGE_SEND_STRATEGY_KINDS,
  MESSAGE_SEND_STRATEGY_KIND_LABELS,
  type MessageSendStrategyKind,
} from '../../kinds'
import SendMostFrequencyPatientsForm from './SendMostFrequencyPatientsForm'
import SendMostRecentPatientsForm from './SendMostRecentPatientsForm'
import SendExcludePatientsListForm from './SendExcludePatientsListForm'
import SendSelectedListForm from './SendSelectedListForm'

function implementedCreateKind(
  kind: MessageSendStrategyKind,
): kind is
  | 'send_most_recent_patients'
  | 'send_most_frequency_patients'
  | 'send_selected_list'
  | 'exclude_patients_list' {
  return (
    kind === 'send_most_recent_patients' ||
    kind === 'send_most_frequency_patients' ||
    kind === 'send_selected_list' ||
    kind === 'exclude_patients_list'
  )
}

export default function CadastroListaEnvio() {
  const [selectedKind, setSelectedKind] =
    useState<MessageSendStrategyKind | null>(null)

  return (
    <div className="space-y-8">
      <Box className="p-0">
        <section className="space-y-3 px-4 py-6">
          <h3 className="text-sm font-semibold text-slate-800">
            {selectedKind ? 'Tipo selecionado' : '1. Tipo de lista'}
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {MESSAGE_SEND_STRATEGY_KINDS.map((kind) => {
              const selected = selectedKind === kind
              const implemented = implementedCreateKind(kind)
              return (
                <button
                  key={kind}
                  type="button"
                  onClick={() => setSelectedKind(kind)}
                  className={`rounded-lg border px-4 py-3 text-left text-sm transition ${
                    selected
                      ? 'border-main bg-purple-50 text-slate-900 ring-2 ring-main/30'
                      : 'border-slate-200 bg-white text-slate-800 hover:border-main/50 hover:bg-slate-50'
                  }`}
                >
                  <span className="font-medium">
                    {MESSAGE_SEND_STRATEGY_KIND_LABELS[kind]}
                  </span>
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

      {selectedKind ? (
        <Box className="p-0">
          <section className="space-y-4 pb-6">
            <div className="space-y-3 px-4 pt-6">
              <h3 className="text-sm font-semibold text-slate-800">
                2. Dados da lista
              </h3>
              {selectedKind === 'send_most_recent_patients' ? (
                <p className="text-sm text-slate-600">
                  Lista com base nos pacientes com consulta mais recente. Defina
                  quantos pacientes deseja incluir a partir do mais recente.
                </p>
              ) : null}
              {selectedKind === 'send_most_frequency_patients' ? (
                <p className="text-sm text-slate-600">
                  Lista com base nos pacientes com maior frequência de
                  consultas. Defina quantos pacientes deseja incluir, ordenados
                  por frequência.
                </p>
              ) : null}
              {selectedKind === 'send_selected_list' ? (
                <p className="text-sm text-slate-600">
                  Escolha manualmente os pacientes que poderão receber o disparo
                  de mensagens.
                </p>
              ) : null}
              {selectedKind === 'exclude_patients_list' ? (
                <p className="text-sm text-slate-600">
                  Marque os pacientes que <strong>não</strong> devem receber
                  disparos automáticos quando esta lista estiver vinculada a uma
                  campanha.
                </p>
              ) : null}
              {!implementedCreateKind(selectedKind) ? (
                <p className="text-sm text-slate-600">
                  O formulário de cadastro para este tipo ainda não está
                  disponível. Escolha um tipo com formulário disponível ou volte
                  mais tarde.
                </p>
              ) : null}
            </div>

            {selectedKind === 'send_most_recent_patients' ? (
              <SendMostRecentPatientsForm mode="create" kind={selectedKind} />
            ) : null}
            {selectedKind === 'send_most_frequency_patients' ? (
              <SendMostFrequencyPatientsForm mode="create" />
            ) : null}
            {selectedKind === 'send_selected_list' ? (
              <SendSelectedListForm mode="create" />
            ) : null}
            {selectedKind === 'exclude_patients_list' ? (
              <SendExcludePatientsListForm mode="create" />
            ) : null}
          </section>
        </Box>
      ) : null}
    </div>
  )
}
