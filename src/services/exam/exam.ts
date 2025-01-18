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
