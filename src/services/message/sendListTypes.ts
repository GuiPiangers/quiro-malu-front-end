import type { MessageSendStrategyKind } from '@/app/(private)/lista-envio/kinds'

/** Alias alinhado ao vocabulário da API de estratégias de envio. */
export type SendStrategyKind = MessageSendStrategyKind

export const SEND_STRATEGY_KIND_SEND_MOST_RECENT_PATIENTS =
  'send_most_recent_patients' as const

export const SEND_STRATEGY_KIND_SEND_MOST_FREQUENCY_PATIENTS =
  'send_most_frequency_patients' as const

export const SEND_STRATEGY_KIND_SEND_SELECTED_LIST =
  'send_selected_list' as const

export const SEND_STRATEGY_KIND_EXCLUDE_PATIENTS_LIST =
  'exclude_patients_list' as const

export type ListedMessageSendStrategyAmountParamKinds =
  | typeof SEND_STRATEGY_KIND_SEND_MOST_RECENT_PATIENTS
  | typeof SEND_STRATEGY_KIND_SEND_MOST_FREQUENCY_PATIENTS

export type ListedMessageSendStrategyPatientListParamKinds =
  | typeof SEND_STRATEGY_KIND_SEND_SELECTED_LIST
  | typeof SEND_STRATEGY_KIND_EXCLUDE_PATIENTS_LIST

export type ListedMessageSendStrategyParamsByKind = {
  [K in MessageSendStrategyKind]: K extends ListedMessageSendStrategyAmountParamKinds
    ? { amount: number }
    : K extends ListedMessageSendStrategyPatientListParamKinds
    ? { patientIdList: string[] }
    : Record<string, unknown>
}

export type MessageSendStrategyPatientSnippet = {
  name: string
  phone: string
  cpf?: string
}

export type ListedMessageSendStrategyDTOForKind<
  K extends MessageSendStrategyKind,
> = {
  id: string
  userId: string
  name: string
  kind: K
  params: ListedMessageSendStrategyParamsByKind[K]
  campaignBindingsCount: number
  patients?: MessageSendStrategyPatientSnippet[]
}

export type ListedMessageSendStrategyDTO = {
  [K in MessageSendStrategyKind]: ListedMessageSendStrategyDTOForKind<K>
}[MessageSendStrategyKind]

export type WithLinkedMessageSendStrategy = {
  linkedMessageSendStrategy: ListedMessageSendStrategyDTO | null
}

export type ListMessageSendStrategyOutput = {
  items: ListedMessageSendStrategyDTO[]
  total: number
  page: number
  limit: number
}

/** Corpo de POST /messageSendStrategies e PATCH /messageSendStrategies/:id */
export type CreateMessageSendStrategyDTO =
  | {
      kind: ListedMessageSendStrategyAmountParamKinds
      name: string
      params: { amount: number }
    }
  | {
      kind: ListedMessageSendStrategyPatientListParamKinds
      name: string
      params: { patientIdList: string[] }
    }

export type PatchMessageSendStrategyDTO = CreateMessageSendStrategyDTO

export type BindableCampaignSource =
  | 'before_schedule'
  | 'after_schedule'
  | 'birthday'

export type BindableCampaignRow = {
  id: string
  name: string
  source: BindableCampaignSource
}
