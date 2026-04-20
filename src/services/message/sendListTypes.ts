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

export type CreateMessageSendStrategyDTO = {
  userId: string
  name: string
  amount: number
  kind: string
}

export type BindableCampaignSource =
  | 'before_schedule'
  | 'after_schedule'
  | 'birthday'

export type BindableCampaignRow = {
  id: string
  name: string
  source: BindableCampaignSource
}
