'use client'

import { Input } from '@/components/input'
import Form, { FormProps } from '@/components/form/Form'
import { sectionStyles } from '@/components/form/Styles'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import useSnackbarContext from '@/hooks/useSnackbarContext copy'
import { SchedulingResponse } from '@/services/scheduling/SchedulingService'
import { responseError } from '@/services/api/api'
import { Currency } from '@/utils/Currency'

import Duration from '@/app/(private)/components/Duration'
import Autocomplete from '@/components/input/Autocomplete'

const setSchedulingSchema = z.object({
  date: z.string().min(1, 'Campo obrigatório'),
  service: z.string(),
  duration: z.coerce.number().optional(),
  status: z.string(),
})

export type setSchedulingData = z.infer<typeof setSchedulingSchema>

type SchedulingFormProps = {
  action(
    data: SchedulingResponse | setSchedulingData,
  ): Promise<SchedulingResponse & responseError>
  formData?: Partial<SchedulingResponse>
  afterValidation?(): void
} & FormProps

export default function SchedulingForm({
  formData,
  afterValidation,
  action,
  ...formProps
}: SchedulingFormProps) {
  const { service, id, duration, date, patientId, status } = formData || {}
  const { handleMessage } = useSnackbarContext()

  const setSchedulingForm = useForm<setSchedulingData>({
    resolver: zodResolver(setSchedulingSchema),
  })

  const {
    handleSubmit,
    formState: { isSubmitting, errors, dirtyFields },
    register,
    reset,
    setValue,
  } = setSchedulingForm

  const setScheduling = async (data: setSchedulingData) => {
    const res = await action({
      id,
      duration: data.duration || duration,
      ...data,
    })
    if (res.error) {
      handleMessage({ title: 'Erro!', description: res.message, type: 'error' })
    } else {
      reset({ ...data })
      if (afterValidation) afterValidation()
      handleMessage({
        title: 'Serviço salvo com sucesso!',
        type: 'success',
      })
    }
  }

  return (
    <Form onSubmit={handleSubmit(setScheduling)} {...formProps}>
      <section aria-label="Diagnóstico do paciente" className={sectionStyles()}>
        <Input.Root>
          <Input.Label required notSave={dirtyFields.date}>
            Data
          </Input.Label>
          <Input.Field
            type="datetime-local"
            autoComplete="off"
            disabled={isSubmitting}
            defaultValue={date}
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
          <Input.Autocomplete
            {...register('service')}
            freeSolo
            disabled={isSubmitting}
            defaultValue={service}
            error={!!errors.service}
            options={[
              { id: 'op1', label: 'opção 1' },
              { id: 'op2', label: 'opção 2' },
            ]}
          />
          {errors.service && (
            <Input.Message error>{errors.service.message}</Input.Message>
          )}
        </Input.Root>

        <Duration
          duration={duration}
          setValue={(value: number) => {
            setValue('duration', value)
          }}
          errors={errors?.duration?.message}
        />

        <Input.Root>
          <Input.Label required notSave={dirtyFields.date}>
            Paciente
          </Input.Label>
          <Input.Field
            autoComplete="off"
            disabled={isSubmitting}
            defaultValue={date}
            error={!!errors.date}
            {...register('date')}
            notSave={dirtyFields.date}
          />
          {errors.date && (
            <Input.Message error>{errors.date.message}</Input.Message>
          )}
        </Input.Root>

        <Input.Root>
          <Input.Label required notSave={dirtyFields.date}>
            Telefone
          </Input.Label>
          <Input.Field
            autoComplete="off"
            disabled={isSubmitting}
            defaultValue={date}
            error={!!errors.date}
            {...register('date')}
            notSave={dirtyFields.date}
          />
          {errors.date && (
            <Input.Message error>{errors.date.message}</Input.Message>
          )}
        </Input.Root>
      </section>
    </Form>
  )
}
