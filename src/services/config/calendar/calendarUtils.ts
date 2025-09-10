import { CalendarConfigurationDTO } from './calendarConfiguration'

export const getWeekDayKey = (index: number) => {
  const weekDays = [
    'domingo',
    'segunda',
    'terca',
    'quarta',
    'quinta',
    'sexta',
    'sabado',
  ]
  return weekDays[index] as keyof Omit<
    CalendarConfigurationDTO,
    'workTimeIncrementInMinutes'
  >
}
