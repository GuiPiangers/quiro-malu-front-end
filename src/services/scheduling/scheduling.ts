'use server'

import { api } from '@/services/api/api'

export type SchedulingStatus =
  | 'Agendado'
  | 'Atendido'
  | 'Atrasado'
  | 'Cancelado'

export type SchedulingResponse = {
  id?: string
  patientId: string
  service: string
  duration: number
  status: SchedulingStatus
  date: string
}
export type SchedulingListResponse = {
  schedules: (SchedulingResponse & { patient: string; phone: string })[]
}

export async function createScheduling(data: SchedulingResponse) {
  const res = await api<SchedulingResponse>('/schedules', {
    method: 'POST',
    body: JSON.stringify(data),
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
  const res = await api<SchedulingListResponse>(
    `/Schedules?page=${page}&date=${date}`,
    {
      method: 'GET',
    },
  )
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
