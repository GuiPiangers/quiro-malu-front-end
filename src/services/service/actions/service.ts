'use server'

import { api } from '@/services/api/api'

export type ServiceResponse = {
  id?: string
  name: string
  duration: number
  value: number
}
export type ServiceListResponse = {
  services: ServiceResponse[]
  total: number
  limit: number
}

export async function createService(data: ServiceResponse) {
  const res = await api<ServiceResponse>('/services', {
    method: 'POST',
    body: JSON.stringify(data),
  })

  return res
}

export async function updateService(data: ServiceResponse) {
  const res = await api<ServiceResponse>('/services', {
    method: 'PATCH',
    body: JSON.stringify(data),
  })

  return res
}

export async function getService(id: string) {
  const res = await api<ServiceResponse>(`/services/${id}`, {
    method: 'GET',
  })
  return res
}

export async function listService({ page }: { page?: string }) {
  const res = await api<ServiceListResponse>(`/services?page=${page}`, {
    method: 'GET',
  })
  return res
}

export async function deleteService({ id }: { id: string }) {
  const res = await api<void>('/services', {
    method: 'DELETE',
    body: JSON.stringify({ id }),
  })
  return res
}
