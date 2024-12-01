'use client'

import Button from '@/components/Button'
import { Validate } from '@/services/api/Validate'
import { clientPatientService } from '@/services/patient/clientPatientService'
import useSnackbarContext from '@/hooks/useSnackbarContext'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { PiPaperclipLight } from 'react-icons/pi'
import { z } from 'zod'
import { FileInput } from '@/components/input/file/FileInput'

export const uploadPatientsSchema = z.object({
  file: z.any(),
})

export type UploadPatientsData = z.infer<typeof uploadPatientsSchema>

export default function PatientsFile() {
  const createPatientForm = useForm<UploadPatientsData>({
    resolver: zodResolver(uploadPatientsSchema),
  })

  const { handleMessage } = useSnackbarContext()

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [successCount, setSuccessCount] = useState<number>()
  const [errorCount, setErrorCount] = useState<number>()
  const [duplicateCount, setDuplicateCount] = useState<number>()
  const inputRef = useRef<HTMLInputElement>(null)

  const {
    handleSubmit,
    formState: { isSubmitting, errors },
    setValue,
    setError,
    reset,
  } = createPatientForm
  const handleUploadPatient = async (data: UploadPatientsData) => {
    try {
      const res = await clientPatientService.upload(data.file)
      if (Validate.isOk(res)) {
        setSuccessCount(res.successCounter)
        setErrorCount(res.erroCounter)
        setDuplicateCount(res.duplicateCounter)
      } else {
        handleMessage({
          title: 'Erro ao salvar pacientes',
          description: res.message,
          type: 'error',
        })
        console.log('chegou aqui')
        setError(
          'file',
          { message: 'Erro ao salvar pacientes' },
          { shouldFocus: false },
        )
      }
    } catch (error: any) {
      handleMessage({
        title: 'Erro ao salvar pacientes',
        description: error.message,
        type: 'error',
      })
      setError('file', { message: 'Erro ao salvar pacientes' })
    } finally {
      setSelectedFile(null)
      if (inputRef.current) {
        inputRef.current.value = ''
      }
    }
  }

  return (
    <form className="space-y-2" onSubmit={handleSubmit(handleUploadPatient)}>
      <div className="flex flex-col gap-1">
        <span>Importar pacientes</span>
        <FileInput
          error={!!errors.file}
          onChange={(e) => {
            const file = e.target.files ? e.target.files[0] : null
            setValue('file', file)
            setSelectedFile(file)
            setSuccessCount(undefined)
            setErrorCount(undefined)
            setDuplicateCount(undefined)
            reset({ file }, { keepValues: true })
          }}
          accept=".csv"
        >
          {selectedFile?.name || 'Selecione um arquivo CSV'}
          <PiPaperclipLight size={24} />
        </FileInput>
      </div>

      {successCount !== undefined && successCount >= 0 ? (
        <p className="text-xs text-green-800">
          {successCount} pacientes salvos com sucesso!
        </p>
      ) : (
        ''
      )}

      {duplicateCount && duplicateCount > 0 ? (
        <p className="text-xs text-yellow-800">
          {duplicateCount} pacientes já existentes!
        </p>
      ) : (
        ''
      )}

      {errorCount && errorCount > 0 ? (
        <p className="text-xs text-red-800">
          {errorCount} erros ao salvar pacientes!
        </p>
      ) : (
        ''
      )}

      <Button color="green" type="submit" disabled={isSubmitting}>
        Salvar
      </Button>
    </form>
  )
}
