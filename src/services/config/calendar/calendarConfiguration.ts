'use server'
import { api } from '@/services/api/api'

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
  return await api<CalendarConfigurationDTO>('/calendar-configuration')
}

export async function setCalendarConfiguration(data: CalendarConfigurationDTO) {
  return await api<CalendarConfigurationDTO>('/calendar-configuration', {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}
