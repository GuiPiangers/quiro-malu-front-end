'use client'

import { saveExam } from '@/services/exam/exam'
import { FileInput, FileInputPropsVariants } from '../input/file/FileInput'
import { useFormStatus } from 'react-dom'
import Button from '../Button'
import { InputHTMLAttributes } from 'react'

type ExamFileInputProps = {
  patientId: string
}

function ExamInput(
  props: InputHTMLAttributes<HTMLInputElement> & FileInputPropsVariants,
) {
  const { pending } = useFormStatus()
  return (
    <FileInput name="file" disabled={pending} {...props}>
      Adicionar um arquivo
    </FileInput>
  )
}

export default function ExamFileInput({ patientId }: ExamFileInputProps) {
  return (
    <form action={saveExam.bind(null, patientId)}>
      <ExamInput
        name="file"
        onChange={(e) => {
          e.preventDefault()
          e.currentTarget.form?.requestSubmit()
        }}
      >
        Adicionar um arquivo
      </ExamInput>
    </form>
  )
}
