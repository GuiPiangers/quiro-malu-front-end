'use client'

import SendPatientIdListStrategyForm from './strategyPatientList/SendPatientIdListStrategyForm'
import type { StrategyPatientListRow } from './strategyPatientList/types'

export type SendExcludePatientsListFormProps =
  | { mode: 'create' }
  | {
      mode: 'edit'
      strategyId: string
      defaultName: string
      initialSelected: StrategyPatientListRow[]
    }

function isEditProps(
  props: SendExcludePatientsListFormProps,
): props is Extract<SendExcludePatientsListFormProps, { mode: 'edit' }> {
  return props.mode === 'edit'
}

const COPY = {
  hintBelowName:
    'Até 50 pacientes. Eles não receberão disparos automáticos desta estratégia. Remova da lista à direita para voltar a incluí-los.',
  namePlaceholder: 'Ex.: Bloqueio campanha lembrete',
  pickerTitle: 'Pacientes (ainda elegíveis ao disparo)',
  selectedTitle: 'Pacientes excluídos do disparo',
  selectedSubtitle:
    'Nome e telefone apenas para conferência; o envio usa o id do paciente.',
  emptySelectedMessage:
    'Nenhum paciente excluído. Use o botão + na lista à esquerda.',
  queryKeyPrefix: 'excludePatientsListPicker',
} as const

export default function SendExcludePatientsListForm(
  props: SendExcludePatientsListFormProps,
) {
  return (
    <SendPatientIdListStrategyForm
      kind="exclude_patients_list"
      copy={COPY}
      {...(isEditProps(props)
        ? {
            mode: 'edit' as const,
            strategyId: props.strategyId,
            defaultName: props.defaultName,
            initialSelected: props.initialSelected,
          }
        : { mode: 'create' as const })}
    />
  )
}
