'use server'

import { api } from '@/services/api/api'

export type SchedulingStatus =
  | 'Agendado'
  | 'Atendido'
  | 'Atrasado'
  | 'Cancelado'

export type BlockScheduleResponse = {
  id?: string
  date: string
  endDate: string
  description?: string
}

export type SchedulingResponse = {
  id?: string
  patientId: string
  service: string
  duration: number
  status: SchedulingStatus
  date: string
}

export type SchedulingWithPatient = SchedulingResponse & {
  patient: string
  phone: string
}

export type SchedulingListResponse = {
  schedules: SchedulingWithPatient[]
}

export type EventsResponse = {
  data: (BlockScheduleResponse | SchedulingWithPatient)[]
}

export type SaveBlockEvent = Omit<BlockScheduleResponse, 'id'>

export async function createScheduling({
  date,
  duration,
  patientId,
  service,
  status,
}: SchedulingResponse) {
  const res = await api<SchedulingResponse>('/schedules', {
    method: 'POST',
    body: JSON.stringify({ date, duration, patientId, service, status }),
  })

  return res
}

export async function updateScheduling(data: Partial<SchedulingResponse>) {
  const res = await api<SchedulingResponse>('/schedules', {
    method: 'PATCH',
    body: JSON.stringify(data),
  })

  return res
}

export async function realizeScheduling({
  id,
  patientId,
}: {
  id: string
  patientId: string
}) {
  const res = await api<SchedulingResponse>('/realizeScheduling', {
    method: 'POST',
    body: JSON.stringify({ id, patientId }),
  })

  return res
}

export async function getScheduling({ id }: { id: string }) {
  const res = await api<SchedulingResponse>(`/schedules/${id}`, {
    method: 'GET',
  })
  return res
}

export async function listSchedules({
  date,
  page,
}: {
  date: string
  page?: string
}) {
  const res = await api<{
    id: string
    date: string
    endDate: string
    description?: string
  }>(`/schedules?page=${page}&date=${date}`, {
    method: 'GET',
  })
  return res
}
export async function listEvents({ date }: { date: string }) {
  const res = await api<EventsResponse>(`/events?date=${date}`, {
    method: 'GET',
  })
  return res
}

export async function saveBlockEvent({
  date,
  endDate,
  description,
}: SaveBlockEvent) {
  const res = await api<{ message: string }>('/blockSchedules', {
    method: 'POST',
    body: JSON.stringify({ date, endDate, description }),
  })

  return res
}

export async function getQtdSchedulesByDay({
  month,
  year,
}: {
  month: number
  year: number
}) {
  const res = await api<{ date: string; qtd: number }[]>(
    `/Schedules/qtd?month=${month}&year=${year}`,
    {
      method: 'GET',
    },
  )
  return res
}

export async function deleteScheduling({ id }: { id: string }) {
  const res = await api<void>('/schedules', {
    method: 'DELETE',
    body: JSON.stringify({ id }),
  })
  return res
}
