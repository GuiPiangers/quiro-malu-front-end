'use server'

import { CreatePatientData } from '@/app/(private)/patients/components/PatientDataForm'
import { api } from '@/services/api/api'

export type LocationDTO = {
  cep?: string
  state?: string
  city?: string
  neighborhood?: string
  address?: string
}

export type PatientResponse = {
  id?: string
  name: string
  phone: string
  dateOfBirth?: string
  gender?: 'masculino' | 'feminino'
  cpf?: string
  location?: LocationDTO
  createAt?: string
  education?: string
  profession?: string
  maritalStatus?: string
}

export type uploadPatientsResponse = {
  duplicateCounter: number
  erroCounter: number
  errors: { error: string; patient: PatientResponse }[]
  successCounter: number
}

export type PatientsListResponse = {
  patients: Array<{
    id?: string
    name: string
    phone: string
    dateOfBirth?: string
  }>
  total: number
  limit: number
}
export type AnamnesisResponse = {
  patientId?: string
  mainProblem?: string
  currentIllness?: string
  history?: string
  familiarHistory?: string
  activities?: string
  smoke?: string | null
  useMedicine?: boolean | null
  medicines?: string
  underwentSurgery?: boolean | null
  surgeries?: string
}
export type DiagnosticResponse = {
  patientId: string
  diagnostic?: string
  treatmentPlan?: string
}
export type ProgressResponse = {
  id: string
  patientId: string
  service: string
  actualProblem: string
  procedures: string
  date: string
  schedulingId?: string
  createAt?: string
  updateAt?: string
}
export type ProgressListResponse = {
  progress: ProgressResponse[]
  total: number
  limit: number
}

export async function createPatient(data: CreatePatientData) {
  const res = await api<PatientResponse>('/patients', {
    method: 'POST',
    body: JSON.stringify(data),
  })

  return res
}

export async function updatePatient(data: PatientResponse) {
  const res = await api<PatientResponse>('/patients', {
    method: 'PATCH',
    body: JSON.stringify(data),
  })

  return res
}

export async function uploadPatient(data: FormData) {
  const res = await api<uploadPatientsResponse>('/uploadPatients', {
    method: 'POST',
    body: data,
    noContentType: true,
  })

  return res
}

export async function getPatient(id: string) {
  const res = await api<PatientResponse>(`/patients/${id}`, {
    method: 'GET',
  })
  return res
}

export async function getAnamnesis(id: string) {
  const res = await api<AnamnesisResponse>(`/patients/anamnesis/${id}`, {
    method: 'GET',
  })
  return res
}

export async function setAnamnesis(data: AnamnesisResponse) {
  const res = await api<void>('/patients/anamnesis', {
    method: 'PUT',
    body: JSON.stringify(data),
  })

  return res
}

export async function getDiagnostic(id: string) {
  const res = await api<DiagnosticResponse>(`/patients/diagnostic/${id}`, {
    method: 'GET',
  })
  return res
}

export async function setDiagnostic(data: DiagnosticResponse) {
  const res = await api<void>('/patients/diagnostic', {
    method: 'PUT',
    body: JSON.stringify(data),
  })

  return res
}

export async function setProgress(data: ProgressResponse) {
  const res = await api<void>('/patients/progress', {
    method: 'PUT',
    body: JSON.stringify(data),
  })
  return res
}

export async function getProgress({
  patientId,
  id,
}: {
  patientId: string
  id: string
}) {
  const res = await api<ProgressResponse>(
    `/patients/progress/${patientId}/${id}`,
    {
      method: 'GET',
    },
  )
  return res
}

export async function getProgressByScheduling({
  patientId,
  schedulingId,
}: {
  patientId: string
  schedulingId: string
}) {
  const res = await api<ProgressResponse>(
    `/patients/progress/scheduling/${patientId}/${schedulingId}`,
    {
      method: 'GET',
    },
  )
  return res
}

export async function listProgress({
  patientId,
  page = '1',
}: {
  patientId: string
  page?: string
}) {
  const res = await api<ProgressListResponse>(
    `/patients/progress/${patientId}?page=${page}`,
    {
      method: 'GET',
    },
  )
  return res
}

export async function listPatient({
  page = '1',
  search,
  orderBy,
  limit = 20,
}: {
  page?: string
  search?: { [key: string]: string }
  orderBy?: [{ field: string; orientation: string }]
  limit?: number | 'all'
}) {
  const searchValue = JSON.stringify(search) || null
  const orderValue = JSON.stringify(orderBy) || null
  const limitValue = limit === 'all' ? limit : JSON.stringify(limit)

  const res = await api<PatientsListResponse>(
    `/patients?page=${page}&search=${searchValue}&orderBy=${orderValue}&limit=${limitValue}`,
    {
      method: 'GET',
    },
  )
  return res
}

export async function deletePatient(id: string) {
  const res = await api<void>('/patients', {
    method: 'DELETE',
    body: JSON.stringify({ id }),
  })
  return res
}

export async function deleteProgress({
  id,
  patientId,
}: {
  id: string
  patientId: string
}) {
  const res = await api<void>('/patients/progress', {
    method: 'DELETE',
    body: JSON.stringify({ id, patientId }),
  })
  return res
}
