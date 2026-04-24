'use client'

import SendPatientIdListStrategyForm from './strategyPatientList/SendPatientIdListStrategyForm'
import type {
  SelectedListPatientRow,
  StrategyPatientListRow,
} from './strategyPatientList/types'

export type { SelectedListPatientRow, StrategyPatientListRow }

export type SendSelectedListFormProps =
  | { mode: 'create' }
  | {
      mode: 'edit'
      strategyId: string
      defaultName: string
      initialSelected: SelectedListPatientRow[]
    }

function isEditProps(
  props: SendSelectedListFormProps,
): props is Extract<SendSelectedListFormProps, { mode: 'edit' }> {
  return props.mode === 'edit'
}

const COPY = {
  hintBelowName:
    'Selecione até 50 pacientes. Os já escolhidos somem da lista à esquerda e aparecem à direita.',
  namePlaceholder: 'Ex.: Convite campanha X',
  pickerTitle: 'Pacientes disponíveis',
  selectedTitle: 'Pacientes selecionados',
  selectedSubtitle: 'Nome e telefone enviados na lista de disparo.',
  emptySelectedMessage:
    'Nenhum paciente selecionado. Use o botão + na lista à esquerda.',
  queryKeyPrefix: 'sendSelectedListPicker',
} as const

export default function SendSelectedListForm(props: SendSelectedListFormProps) {
  return (
    <SendPatientIdListStrategyForm
      kind="send_selected_list"
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
