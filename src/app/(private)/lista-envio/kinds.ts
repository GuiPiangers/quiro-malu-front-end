export const MESSAGE_SEND_STRATEGY_KINDS = [
  'send_most_recent_patients',
  'send_most_frequency_patients',
  'send_selected_list',
  'exclude_patients_list',
] as const

export type MessageSendStrategyKind =
  (typeof MESSAGE_SEND_STRATEGY_KINDS)[number]

export const MESSAGE_SEND_STRATEGY_KIND_LABELS: Record<
  MessageSendStrategyKind,
  string
> = {
  send_most_recent_patients: 'Pacientes mais Recentes',
  send_most_frequency_patients: 'Pacientes mais Frequentes',
  send_selected_list: 'Pacientes selecionados',
  exclude_patients_list: 'Pacientes não selecionados',
}
