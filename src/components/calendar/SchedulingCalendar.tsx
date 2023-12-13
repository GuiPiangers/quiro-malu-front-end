'use client'

import Calendar from './Calendar'
import { clientSchedulingService } from '@/services/scheduling/clientScheduling'

export default function SchedulingCalendar() {
  const getAppointments = async ({
    month,
    year,
  }: {
    month: number
    year: number
  }) => {
    return clientSchedulingService.getQtdSchedulesByDay({ month, year })
  }
  return <Calendar getAppointments={getAppointments} />
}
