'use server'

import { api } from '@/services/api/api'

export type FinanceResponse = {
  id?: string
  date: string
  description: string
  type: 'income' | 'expense'
  paymentMethod?: string
  value: number
  patientId?: string
  schedulingId?: string
  service?: string
}
export type FinanceListResponse = FinanceResponse[]

export async function createFinance(data: FinanceResponse) {
  const res = await api<FinanceResponse>('/finance', {
    method: 'POST',
    body: JSON.stringify(data),
  })

  return res
}

export async function updateFinance(data: FinanceResponse) {
  const res = await api<FinanceResponse>('/finance', {
    method: 'PATCH',
    body: JSON.stringify(data),
  })

  return res
}

export async function getFinance(id: string) {
  const res = await api<FinanceResponse>(`/finance/${id}`, {
    method: 'GET',
  })
  return res
}

export async function listFinances({ page }: { page?: string } = {}) {
  const res = await api<FinanceListResponse>(`/finance?page=${page}`, {
    method: 'GET',
  })
  return res
}

export async function deleteFinance({ id }: { id: string }) {
  const res = await api<void>('/finance', {
    method: 'DELETE',
    body: JSON.stringify({ id }),
  })
  return res
}
