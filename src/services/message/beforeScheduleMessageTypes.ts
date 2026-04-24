import type { MessageTemplateDTO } from './birthdayMessageTypes'

export type BeforeScheduleMessageDTO = {
  id?: string
  name: string
  minutesBeforeSchedule: number
  isActive: boolean
  messageTemplate: MessageTemplateDTO
}

export type BeforeScheduleMessageResponse = {
  id?: string
  name: string
  templateMessage: string
  active: boolean
  delay?: number
  delayUnit?: 'minutes' | 'hours' | 'days'
  minutesBeforeSchedule?: number
}

export type ListBeforeScheduleMessagesOutput = {
  items: BeforeScheduleMessageDTO[]
  total: number
  page: number
  limit: number
}
