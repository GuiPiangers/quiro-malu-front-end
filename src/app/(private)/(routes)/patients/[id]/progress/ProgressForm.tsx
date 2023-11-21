'use client'

import { Input } from '@/components/formField'
import Form, { FormProps } from '../../../../../../components/form/Form'
import { sectionStyles } from '../../../../../../components/form/Styles'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { clientPatientService } from '@/services/patient/clientPatientService'
import useSnackbarContext from '@/hooks/useSnackbarContext copy'
import { ProgressResponse } from '@/services/patient/PatientService'
import DateTime from '@/utils/Date'

const setProgressSchema = z.object({
  actualProblem: z.string(),
  procedures: z.string(),
  service: z.string().min(1, { message: 'Campo obrigatório' }),
  date: z.string().min(1, { message: 'Campo obrigatório' }),
})

export type setProgressData = z.infer<typeof setProgressSchema>

type ProgressFormProps = {
  formData: Partial<ProgressResponse>
  afterValidation?(): void
} & FormProps

export default function ProgressForm({
  formData,
  afterValidation,
  ...formProps
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

  return (
    <Form onSubmit={handleSubmit(setProgress)} {...formProps}>
      <section aria-label="Diagnóstico do paciente" className={sectionStyles()}>
        <Input.Root>
          <Input.Label required notSave={dirtyFields.date}>
            Data
          </Input.Label>
          <Input.Field
            autoComplete="off"
            disabled={isSubmitting}
            type="datetime-local"
            defaultValue={DateTime.getIsoDateTime(date || new Date())}
            error={!!errors.date}
            {...register('date')}
            notSave={dirtyFields.date}
          />
          {errors.date && (
            <Input.Message error>{errors.date.message}</Input.Message>
          )}
        </Input.Root>

        <Input.Root>
          <Input.Label required notSave={dirtyFields.service}>
            Serviço
          </Input.Label>
          <Input.Field
            autoComplete="off"
            disabled={isSubmitting}
            defaultValue={service}
            {...register('service')}
            error={!!errors.service}
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
            autoComplete="off"
            multiline
            minRows={4}
            disabled={isSubmitting}
            defaultValue={actualProblem}
            error={!!errors.actualProblem}
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
            autoComplete="off"
            multiline
            minRows={4}
            disabled={isSubmitting}
            defaultValue={procedures}
            error={!!errors.procedures}
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
