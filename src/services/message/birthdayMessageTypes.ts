export type MessageTemplateDTO = {
  textTemplate: string
}

export type BirthdayMessageDTO = {
  id?: string
  name: string
  isActive: boolean
  sendTime: string
  messageTemplate: MessageTemplateDTO
}

export type BirthdayMessageResponse = {
  id?: string
  name: string
  templateMessage: string
  active: boolean
  sendTime?: string
}

export type ListBirthdayMessagesDTO = {
  userId: string
  page?: number
  limit?: number
}

export type ListBirthdayMessagesOutput = {
  items: BirthdayMessageDTO[]
  total: number
  page: number
  limit: number
}
