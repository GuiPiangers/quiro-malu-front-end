import type { MessageTemplateDTO } from './birthdayMessageTypes'

export type AfterScheduleMessageDTO = {
  id?: string
  name: string
  minutesAfterSchedule: number
  isActive: boolean
  messageTemplate: MessageTemplateDTO
}

export type AfterScheduleMessageResponse = {
  id?: string
  name: string
  templateMessage: string
  active: boolean
  delay?: number
  delayUnit?: 'minutes' | 'hours' | 'days'
  minutesAfterSchedule?: number
}

export type ListAfterScheduleMessagesOutput = {
  items: AfterScheduleMessageDTO[]
  total: number
  page: number
  limit: number
}
