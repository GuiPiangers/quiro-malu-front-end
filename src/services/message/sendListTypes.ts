export type ListedMessageSendStrategyDTO = {
  id: string
  userId: string
  kind: string
  name: string
  params: Record<string, unknown>
  campaignBindingsCount: number
}

export type ListMessageSendStrategyOutput = {
  items: ListedMessageSendStrategyDTO[]
  total: number
  page: number
  limit: number
}

/** Corpo de POST /messageSendStrategies e PATCH /messageSendStrategies/:id */
export type MessageSendStrategyWriteBody = {
  kind: string
  name: string
  params: { amount: number }
}

export type CreateMessageSendStrategyDTO = MessageSendStrategyWriteBody

export type PatchMessageSendStrategyDTO = MessageSendStrategyWriteBody

export type BindableCampaignSource =
  | 'before_schedule'
  | 'after_schedule'
  | 'birthday'

export type BindableCampaignRow = {
  id: string
  name: string
  source: BindableCampaignSource
}
