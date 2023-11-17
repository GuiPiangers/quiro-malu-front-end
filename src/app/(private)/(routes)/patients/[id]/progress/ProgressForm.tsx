'use client'

import { Input } from '@/components/formField'
import Form from '../../components/Form'
import { sectionStyles } from '../../components/Styles'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { clientPatientService } from '@/services/patient/clientPatientService'
import useSnackbarContext from '@/hooks/useSnackbarContext copy'
import { ProgressResponse } from '@/services/patient/PatientService'
import { useCallback } from 'react'

const setProgressSchema = z.object({
  actualProblem: z.string(),
  procedures: z.string(),
  service: z.string(),
  date: z.string(),
})

export type setProgressData = z.infer<typeof setProgressSchema>

type ProgressFormProps = {
  formData: Partial<ProgressResponse>
  afterValidation?(): void
}

export default function ProgressForm({
  formData,
  afterValidation,
}: ProgressFormProps) {
  const { patientId, actualProblem, date, procedures, service, id } = formData

  const { handleMessage } = useSnackbarContext()
  const setProgressForm = useForm<ProgressResponse>({
    resolver: zodResolver(setProgressSchema),
  })

  const {
    handleSubmit,
    formState: { isSubmitting, errors, dirtyFields },
    register,
    reset,
  } = setProgressForm

  const setProgress = async (data: setProgressData) => {
    const res = await clientPatientService.setProgress({
      id: id!,
      patientId: patientId!,
      ...data,
    })
    if (res.error) {
      handleMessage({ title: 'Erro!', description: res.message, type: 'error' })
    } else {
      reset({ ...data })
      if (afterValidation) afterValidation()
      handleMessage({
        title: 'Diagnóstico salvo com sucesso!',
        type: 'success',
      })
    }
  }

  const now = useCallback(() => {
    const dateValue = new Date().toISOString().substring(0, 10)
    const timeValue = new Date().toTimeString().substring(0, 5)
    return `${dateValue}T${timeValue}`
  }, [])

  return (
    <Form onSubmit={handleSubmit(setProgress)}>
      <section aria-label="Diagnóstico do paciente" className={sectionStyles()}>
        <Input.Root>
          <Input.Label notSave={dirtyFields.date}>Data</Input.Label>
          <Input.Field
            disabled={isSubmitting}
            type="datetime-local"
            defaultValue={date || now()}
            {...register('date')}
            notSave={dirtyFields.date}
          />
          {errors.date && (
            <Input.Message error>{errors.date.message}</Input.Message>
          )}
        </Input.Root>

        <Input.Root>
          <Input.Label notSave={dirtyFields.procedures}>Serviço</Input.Label>
          <Input.Field
            disabled={isSubmitting}
            defaultValue={service}
            {...register('service')}
            notSave={dirtyFields.service}
          />
          {errors.service && (
            <Input.Message error>{errors.service.message}</Input.Message>
          )}
        </Input.Root>

        <Input.Root>
          <Input.Label notSave={dirtyFields.actualProblem}>
            Problema atual
          </Input.Label>
          <Input.Field
            multiline
            minRows={4}
            disabled={isSubmitting}
            defaultValue={actualProblem}
            {...register('actualProblem')}
            notSave={dirtyFields.actualProblem}
          />
          {errors.actualProblem && (
            <Input.Message error>{errors.actualProblem.message}</Input.Message>
          )}
        </Input.Root>

        <Input.Root>
          <Input.Label notSave={dirtyFields.procedures}>
            Procedimentos
          </Input.Label>
          <Input.Field
            multiline
            minRows={4}
            disabled={isSubmitting}
            defaultValue={procedures}
            {...register('procedures')}
            notSave={dirtyFields.procedures}
          />
          {errors.procedures && (
            <Input.Message error>{errors.procedures.message}</Input.Message>
          )}
        </Input.Root>
      </section>
    </Form>
  )
}
