'use client'

import { getQtdSchedulesByDay } from '@/services/scheduling/scheduling'
import Calendar from './Calendar'

export default function SchedulingCalendar() {
  const getAppointments = async ({
    month,
    year,
  }: {
    month: number
    year: number
  }) => {
    return getQtdSchedulesByDay({ month, year })
  }
  return <Calendar getAppointments={getAppointments} />
}
