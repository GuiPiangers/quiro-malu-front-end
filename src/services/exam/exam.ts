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

export type ExamsListResponse = { total: number; exams: ExamResponse[] }

export async function saveExam(patientId: string, data: FormData) {
  const formData = new FormData()
  const unformattedFile = (data.get('file') as File) || new File([], '')

  formData.append(
    'file',
    new File(
      [unformattedFile],
      Buffer.from(unformattedFile?.name, 'latin1').toString('utf8') ?? '',
      {
        type: unformattedFile.type,
        lastModified: unformattedFile.lastModified,
      },
    ),
  )

  console.log(formData.get('file'))

  const res = await api<void>(`/exams/${patientId}`, {
    method: 'POST',
    body: formData,
    noContentType: true,
    headers: {
      'Accept-Charset': 'utf-8',
    },
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

export async function deleteExam({
  id,
  patientId,
}: {
  id: string
  patientId: string
}) {
  const res = await api<ExamResponse>(`/exams/${patientId}/${id}`, {
    method: 'DELETE',
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
  const res = await api<ExamsListResponse>(`/exams/${patientId}?page=${page}`, {
    method: 'GET',
  })
  return res
}
