'use client'

import Button from '@/components/Button'
import { Validate } from '@/services/api/Validate'
import { clientPatientService } from '@/services/patient/clientPatientService'
import { zodResolver } from '@hookform/resolvers/zod'
import { InputHTMLAttributes, useState } from 'react'
import { useForm } from 'react-hook-form'
import { PiPaperclipLight } from 'react-icons/pi'
import { z } from 'zod'

export const uploadPatientsSchema = z.object({
  file: z.any(),
})

export type UploadPatientsData = z.infer<typeof uploadPatientsSchema>

export default function PatientsFile() {
  const createPatientForm = useForm<UploadPatientsData>({
    resolver: zodResolver(uploadPatientsSchema),
  })

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [successCount, setSuccessCount] = useState<number>()
  const [errorCount, setErrorCount] = useState<number>()
  const [duplicateCount, setDuplicateCount] = useState<number>()

  const {
    handleSubmit,
    formState: { isSubmitting },
    setValue,
    reset,
  } = createPatientForm

  const handleUploadPatient = async (data: UploadPatientsData) => {
    try {
      const res = await clientPatientService.upload(data.file)
      if (Validate.isOk(res)) {
        setSuccessCount(res.successCounter)
        setErrorCount(res.erroCounter)
        setDuplicateCount(res.duplicateCounter)
        console.log(res)
      }
      reset()
      setSelectedFile(null)
    } catch (error: any) {
      console.log(error)
    }
  }

  return (
    <form className="space-y-2" onSubmit={handleSubmit(handleUploadPatient)}>
      <div className="flex flex-col gap-1">
        <span>Importar pacientes</span>
        <Button
          asChild
          variant="outline"
          size="small"
          className="border-dashed hover:bg-slate-100 hover:text-main"
        >
          <label htmlFor="select-file" className="cursor-pointer">
            {selectedFile?.name || 'Selecione um arquivo CSV'}
            <PiPaperclipLight size={24} />
          </label>
        </Button>
        <input
          type="file"
          onChange={(e) => {
            const file = e.target.files ? e.target.files[0] : null
            setValue('file', file)
            setSelectedFile(file)
          }}
          accept=".csv"
          id="select-file"
          className="h-0 w-0 opacity-0"
        />
      </div>
      {successCount && successCount > 0 ? (
        <p className="text-xs">{successCount} pacientes salvos com sucesso!</p>
      ) : (
        ''
      )}
      {errorCount && errorCount > 0 ? (
        <p className="text-xs">{errorCount} erros ao salvar pacientes!</p>
      ) : (
        ''
      )}
      {duplicateCount && duplicateCount > 0 ? (
        <p className="text-xs">{duplicateCount} pacientes já existentes!</p>
      ) : (
        ''
      )}

      <Button color="green" type="submit" disabled={isSubmitting}>
        Salvar
      </Button>
    </form>
  )
}
