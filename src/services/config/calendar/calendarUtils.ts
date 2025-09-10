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

export const defaultConfiguration: CalendarConfigurationDTO = {
  workTimeIncrementInMinutes: 30,
  domingo: { workSchedules: [], isActive: false },
  segunda: {
    workSchedules: [
      { start: '07:00', end: '11:00' },
      { start: '13:00', end: '19:00' },
    ],
    isActive: true,
  },
  terca: {
    workSchedules: [
      { start: '07:00', end: '11:00' },
      { start: '13:00', end: '19:00' },
    ],
    isActive: true,
  },
  quarta: {
    workSchedules: [
      { start: '07:00', end: '11:00' },
      { start: '13:00', end: '19:00' },
    ],
    isActive: true,
  },
  quinta: {
    workSchedules: [
      { start: '07:00', end: '11:00' },
      { start: '13:00', end: '19:00' },
    ],
    isActive: true,
  },
  sexta: {
    workSchedules: [
      { start: '07:00', end: '11:00' },
      { start: '13:00', end: '19:00' },
    ],
    isActive: true,
  },
  sabado: {
    workSchedules: [
      { start: '07:00', end: '11:00' },
      { start: '13:00', end: '19:00' },
    ],
    isActive: true,
  },
}
