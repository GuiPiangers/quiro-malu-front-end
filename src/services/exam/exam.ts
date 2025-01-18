'use server'

import { api } from '@/services/api/api'

export type SaveExamData = {
  patientId: string
  exam: File
}

export type ExamResponse = {
  id: string
  patientId: string
  fileName: string
  url: string
}

export async function saveExam(patientId: string, data: FormData) {
  console.log(patientId)

  const res = await api<void>(`/exams/${patientId}`, {
    method: 'POST',
    body: data,
    noContentType: true,
  })
  return res
}

export async function getExam({
  id,
  patientId,
}: {
  id: string
  patientId: string
}) {
  const res = await api<ExamResponse>(`/exams/${patientId}/${id}`, {
    method: 'GET',
  })
  return res
}

export async function listExams({
  patientId,
  page,
}: {
  patientId: string
  page: number
}) {
  const res = await api<ExamResponse[]>(`/exams/${patientId}?page=${page}`, {
    method: 'GET',
  })
  return res
}
