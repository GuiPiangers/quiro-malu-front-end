'use server'

import { api } from '@/services/api/api'

export type SchedulingStatus =
  | 'Agendado'
  | 'Atendido'
  | 'Atrasado'
  | 'Cancelado'

export type BlockScheduleResponse = {
  id?: string
  userId?: string
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
  userId?: string
}

export type CreateSchedulingInput = SchedulingResponse & {
  userId: string
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

export type SaveBlockEvent = Omit<BlockScheduleResponse, 'id'> & {
  userId: string
}
export type UpdateBlockEvent = Partial<Omit<BlockScheduleResponse, 'id'>> & {
  id: string
  userId: string
}

export type EventsSuggestion = {
  id?: string
  description: string
  durationInMinutes: number
  frequency: number
}

export type EventsSuggestionsResponse = {
  data: EventsSuggestion[]
}

export async function createScheduling({
  date,
  duration,
  patientId,
  service,
  status,
  userId,
}: CreateSchedulingInput) {
  const res = await api<SchedulingResponse>('/schedules', {
    method: 'POST',
    body: JSON.stringify({
      date,
      duration,
      patientId,
      service,
      status,
      userId,
    }),
  })

  return res
}

export type UpdateSchedulingInput = Partial<SchedulingResponse> & {
  id: string
  userId: string
}

export async function updateScheduling(data: UpdateSchedulingInput) {
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
    `/schedules?page=${page}&date=${date}`,
    {
      method: 'GET',
    },
  )
  return res
}
export async function listEvents({ date }: { date: string }) {
  const res = await api<EventsResponse>(`/events?date=${date}`, {
    method: 'GET',
  })
  return res
}

export async function listEventsByUser({
  userId,
  date,
}: {
  userId: string
  date: string
}) {
  const res = await api<EventsResponse>('/events/by-user', {
    method: 'POST',
    body: JSON.stringify({ userId, date }),
  })

  return res
}

export async function listEventSuggestions({
  filter,
}: { filter?: string } = {}) {
  const res = await api<EventsSuggestionsResponse>(
    `/event-suggestions?filter=${filter}`,
    {
      method: 'GET',
    },
  )
  return res
}

export async function saveBlockEvent({
  userId,
  date,
  endDate,
  description,
}: SaveBlockEvent) {
  const res = await api<{ message: string }>('/blockSchedules', {
    method: 'POST',
    body: JSON.stringify({ userId, date, endDate, description }),
  })

  return res
}

export async function updateBlockEvent({
  id,
  userId,
  ...data
}: UpdateBlockEvent) {
  const res = await api<{ message: string }>(`/blockSchedules/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ userId, ...data }),
  })

  return res
}

export async function deleteBlockEvent({ id }: { id: string }) {
  const res = await api<{ message: string }>(`/blockSchedules/${id}`, {
    method: 'DELETE',
  })

  return res
}

export async function getQtdSchedulesByDay({
  userId,
  month,
  year,
}: {
  userId: string
  month: number
  year: number
}) {
  const res = await api<{ date: string; qtd: number }[]>(
    `/schedules/qtd/${userId}?month=${month}&year=${year}`,
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
