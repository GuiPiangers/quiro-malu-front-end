'use client'

import { FileInput, FileInputPropsVariants } from '../input/file/FileInput'
import { InputHTMLAttributes } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import useSnackbarContext from '@/hooks/useSnackbarContext'
import { Validate } from '@/services/api/Validate'
import { useQueryClient } from '@tanstack/react-query'
import { useSaveExam } from '@/hooks/exam/useSaveExam'

type ExamFileInputProps = {
  patientId: string
}

export const uploadExamSchema = z.object({
  file: z
    .instanceof(File)
    .nullable()
    .refine((file) => {
      if (!file) return true
      return file.size < 1024 * 1024 * 100 // 100MB
    }, 'File size must be less than 2MB'),
})
export type UploadExamData = z.infer<typeof uploadExamSchema>

function ExamInput(
  props: InputHTMLAttributes<HTMLInputElement> & FileInputPropsVariants,
) {
  return (
    <FileInput name="file" {...props}>
      Adicionar um arquivo
    </FileInput>
  )
}

export default function ExamFileInput({
  patientId,
  ...props
}: ExamFileInputProps &
  InputHTMLAttributes<HTMLInputElement> &
  FileInputPropsVariants) {
  const queryClient = useQueryClient()
  const saveExam = useSaveExam()

  const createPatientForm = useForm<UploadExamData>({
    resolver: zodResolver(uploadExamSchema),
  })

  const { handleMessage } = useSnackbarContext()

  const {
    handleSubmit,
    formState: { isSubmitting, errors },
    setValue,
    reset,
  } = createPatientForm

  const handleUploadExam = async (data: UploadExamData) => {
    try {
      const formData = new FormData()
      formData.append('file', data.file ?? new File([], ''))

      const res = await saveExam.mutateAsync({ patientId, formData })

      if (Validate.isOk(res)) {
        queryClient.invalidateQueries({ queryKey: ['exams', { patientId }] })
        handleMessage({
          title: 'Exame salvo com sucesso',
          type: 'success',
        })
        reset()
      } else {
        handleMessage({
          title: res.message,
          type: 'error',
        })
      }
    } catch {}
  }

  return (
    <form onSubmit={handleSubmit(handleUploadExam)}>
      <ExamInput
        accept=".pdf,image/*,.doc,.docx,application/msword"
        {...props}
        disabled={isSubmitting}
        name="file"
        onChange={(e) => {
          setValue('file', e.target.files?.[0] ?? null)
          e.preventDefault()
          e.currentTarget.form?.requestSubmit()
        }}
      >
        Adicionar um arquivo
      </ExamInput>
      {errors.file && (
        <span className="text-xs text-red-500">{errors.file.message}</span>
      )}
    </form>
  )
}
