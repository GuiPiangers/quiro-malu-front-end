'use server'

import { api } from '@/services/api/api'
import { Validate } from '@/services/api/Validate'

export type ClinicUserListItem = {
  id: string
  name: string
  email: string
  phone: string
  clinicId: string
  roleId: string | null
}

export type ClinicianServiceItem = {
  id: string
  name: string
  value: number
  duration: number
}

export type ClinicianListItem = ClinicUserListItem & {
  roleId?: string
  services: ClinicianServiceItem[]
}

export type StandardUserDetail = ClinicUserListItem & {
  kind: 'user'
}

export type ClinicianUserDetail = ClinicUserListItem & {
  kind: 'clinician'
  services: ClinicianServiceItem[]
}

export type UserDetail = StandardUserDetail | ClinicianUserDetail

export type CreateStandardUserInput = {
  name: string
  email: string
  phone: string
  password: string
  roleId: string
}

export type CreateClinicianInput = CreateStandardUserInput & {
  services?: Array<{ serviceId: string }>
}

export type ClinicProfile = {
  id?: string
  name: string
  email: string
  phone: string
  clinicId: string
  roleId?: string
}

export async function getClinicProfile() {
  return api<ClinicProfile>('/profile', {
    method: 'GET',
    cache: 'no-store',
  })
}

export async function listClinicUsers() {
  return api<ClinicUserListItem[]>('/users', { method: 'GET' })
}

export async function listClinicians() {
  return api<ClinicianListItem[]>('/clinicians', { method: 'GET' })
}

export async function getClinicUser(id: string) {
  return api<UserDetail>(`/users/${id}`, { method: 'GET' })
}

export async function createStandardClinicUser(data: CreateStandardUserInput) {
  const profile = await getClinicProfile()
  if (Validate.isError(profile)) return profile

  const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...data, clinicId: profile.clinicId }),
  })

  return res.json()
}

export async function createClinician(data: CreateClinicianInput) {
  return api<ClinicianListItem>('/clinicians', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function patchUserRole({
  id,
  roleId,
}: {
  id: string
  roleId: string
}) {
  return api<void>(`/users/${id}/role`, {
    method: 'PATCH',
    body: JSON.stringify({ roleId }),
  })
}

export async function setClinicianServices({
  id,
  services,
}: {
  id: string
  services: Array<{ serviceId: string }>
}) {
  return api<ClinicianListItem>(`/clinicians/${id}/services`, {
    method: 'PUT',
    body: JSON.stringify({ services }),
  })
}

export async function deleteClinicUser({ id }: { id: string }) {
  return api<void>(`/users/${id}`, { method: 'DELETE' })
}
