'use server'
import { api } from '@/services/api/api'
import { Validate } from '@/services/api/Validate'
import { defaultConfiguration } from './calendarUtils'

export type WorkSchedule = {
  start: string
  end: string
}

export type DayConfiguration = {
  workSchedules: WorkSchedule[]
  isActive?: boolean
}

export type CalendarConfigurationDTO = {
  workTimeIncrementInMinutes?: number
  domingo?: DayConfiguration
  segunda?: DayConfiguration
  terca?: DayConfiguration
  quarta?: DayConfiguration
  quinta?: DayConfiguration
  sexta?: DayConfiguration
  sabado?: DayConfiguration
}

export async function getCalendarConfiguration() {
  const result = await api<CalendarConfigurationDTO>('/calendar-configuration')

  if ((Validate.isOk(result) && !result) || Validate.isError(result)) {
    return defaultConfiguration
  }

  return result
}

export async function setCalendarConfiguration(data: CalendarConfigurationDTO) {
  return await api('/calendar-configuration', {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}
