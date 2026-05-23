'use client'

import { useSearchParams } from 'next/navigation'
import Calendar from './Calendar'

export default function SchedulingCalendar() {
  const userId = useSearchParams().get('userId') ?? ''

  return <Calendar schedulesQtdUserId={userId} />
}
