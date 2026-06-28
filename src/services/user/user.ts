'use server'

import { api } from '@/services/api/api'
import { Validate } from '@/services/api/Validate'
import { CreateUserData } from '@/app/(authentication)/register/page'

export type ClinicUserListItem = {
  id: string
  name: string
  email: string
  phone: string
  clinicId: string
  roleId: string | null
  status: 'active' | 'inactive' | 'pending'
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

export type UserProfile = {
  id?: string
  name: string
  email: string
  phone: string
  clinicId: string
  roleId?: string
}

export async function getUser() {
  return api<UserProfile>('/profile', {
    method: 'GET',
    cache: 'no-store',
  })
}

export async function registerUser(data: CreateUserData) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/register`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
  })
  return await res.json()
}

export async function listClinicUsers() {
  return api<ClinicUserListItem[]>('/users', { method: 'GET' })
}

export type ListCliniciansResponse = {
  result: ClinicianListItem[]
}

export async function listClinicians() {
  const res = await api<ListCliniciansResponse>('/clinicians', {
    method: 'GET',
  })
  if (Validate.isError(res)) return res
  return res.result
}

export async function getClinicUser(id: string) {
  return api<UserDetail>(`/users/${id}`, { method: 'GET' })
}

export async function createStandardClinicUser(data: CreateStandardUserInput) {
  const profile = await getUser()
  if (Validate.isError(profile)) return profile

  const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...data, clinicId: profile.clinicId }),
  })

  return res.json()
}

export async function createClinician(data: CreateClinicianInput) {
  const profile = await getUser()
  if (Validate.isError(profile)) return profile

  const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: data.name,
      email: data.email,
      phone: data.phone,
      password: data.password,
      clinicId: profile.clinicId,
      roleId: data.roleId,
    }),
  })

  const user = await res.json()

  if (!res.ok) {
    return user
  }

  const clinicianRes = await api<ClinicianListItem>('/clinicians', {
    method: 'POST',
    body: JSON.stringify({ userId: user.id }),
  })

  if (Validate.isError(clinicianRes)) return clinicianRes

  if (data.services && data.services.length > 0) {
    const servicesRes = await setClinicianServices({
      id: user.id,
      services: data.services,
    })
    if (Validate.isError(servicesRes)) return servicesRes
    return servicesRes
  }

  return clinicianRes
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
