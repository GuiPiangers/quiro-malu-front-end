'use client'

import { Input } from '@/components/input'
import Form, { FormProps } from '../../../../../../components/form/Form'
import { sectionStyles } from '../../../../../../components/form/Styles'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import useSnackbarContext from '@/hooks/useSnackbarContext copy'
import { ProgressResponse } from '@/services/patient/PatientService'
import DateTime from '@/utils/Date'
import { useEffect, useState } from 'react'
import { clientService } from '@/services/service/clientService'
import { ServiceResponse } from '@/services/service/Service'
import { Validate } from '@/services/api/Validate'
import { responseError } from '@/services/api/api'

export const setProgressSchema = z.object({
  actualProblem: z.string(),
  procedures: z.string(),
  service: z.string().min(1, { message: 'Campo obrigatório' }),
  date: z.string().min(1, { message: 'Campo obrigatório' }),
})

export type setProgressData = z.infer<typeof setProgressSchema>

export type ProgressFormProps = {
  formData: Partial<ProgressResponse>
  formAction(data: ProgressResponse): void | Promise<responseError | void>
  afterValidation?(): void
} & FormProps

export default function ProgressForm({
  formData,
  formAction,
  afterValidation,
  ...formProps
}: ProgressFormProps) {
  const { patientId, actualProblem, date, procedures, service, id } = formData
  const [services, setServices] = useState<ServiceResponse[]>()

  const { handleMessage } = useSnackbarContext()
  const setProgressForm = useForm<ProgressResponse>({
    resolver: zodResolver(setProgressSchema),
  })

  const {
    handleSubmit,
    formState: { isSubmitting, errors, dirtyFields },
    register,
    setValue,
  } = setProgressForm

  useEffect(() => {
    clientService
      .list({})
      .then((res) => Validate.isOk(res) && setServices(res.services))
  }, [])

  useEffect(() => {
    if (service) setValue('service', service)
  }, [service, setValue])

  const setProgress = async (data: setProgressData) => {
    const res = await formAction({
      id: id!,
      patientId: patientId!,
      ...data,
    })
    if (Validate.isError(res)) {
      handleMessage({ title: 'Erro!', description: res.message, type: 'error' })
    } else {
      if (afterValidation) afterValidation()
      handleMessage({
        title: 'Evolução salva com sucesso!',
        type: 'success',
      })
    }
  }

  return (
    <Form onSubmit={handleSubmit(setProgress)} {...formProps}>
      <section aria-label="Evolução do paciente" className={sectionStyles()}>
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
          <Input.Select
            {...register('service')}
            disabled={isSubmitting}
            defaultValue={service}
            error={!!errors.service}
            slotProps={{ popper: { className: 'z-40' } }}
            onChange={(_, newValue) => setValue('service', newValue as string)}
          >
            {services?.map((service) => (
              <Input.Option key={service.id} value={service.name}>
                {service.name}
              </Input.Option>
            ))}
          </Input.Select>

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
