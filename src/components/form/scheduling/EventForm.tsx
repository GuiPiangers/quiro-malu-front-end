'use client'

import { Input } from '@/components/input'
import Form, { FormProps } from '@/components/form/Form'
import { sectionStyles } from '@/components/form/Styles'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import useSnackbarContext from '@/hooks/useSnackbarContext'

import DateTime from '@/utils/Date'

const setEventSchema = z.object({
  date: z.string().min(1, { message: 'Campo obrigatório' }),
  endDate: z.string().min(1, { message: 'Campo obrigatório' }),
  description: z.string(),
})

export type setEventData = z.infer<typeof setEventSchema>

type EventFormProps = {
  formData?: Partial<setEventData>
  afterValidation?(): void
} & FormProps

export default function EventForm({
  formData,
  afterValidation,
  ...formProps
}: EventFormProps) {
  const { date, endDate } = formData || {}
  const { handleMessage } = useSnackbarContext()

  const setEventForm = useForm<setEventData>({
    resolver: zodResolver(setEventSchema),
  })

  const {
    handleSubmit,
    formState: { isSubmitting, errors, dirtyFields },
    register,
    reset,
  } = setEventForm

  const setEvent = async (data: setEventData) => {
    console.log(data)
    handleMessage({ title: 'Evento salvo com sucesso!', type: 'success' })
  }

  return (
    <Form onSubmit={handleSubmit(setEvent)} {...formProps}>
      <section aria-label="Diagnóstico do paciente" className={sectionStyles()}>
        <Input.Root>
          <Input.Label required>Nome do evento</Input.Label>
          <Input.Field autoComplete="off" {...register('description')} />
          {errors.description && (
            <Input.Message error>{errors.description.message}</Input.Message>
          )}
        </Input.Root>

        <Input.Root>
          <Input.Label required notSave={dirtyFields.date}>
            Data de início
          </Input.Label>
          <Input.Field
            type="datetime-local"
            autoComplete="off"
            defaultValue={date ? DateTime.getIsoDateTime(date) : ''}
            disabled={isSubmitting}
            error={!!errors.date}
            {...register('date')}
            notSave={dirtyFields.date}
          />
          {errors.date && (
            <Input.Message error>{errors.date.message}</Input.Message>
          )}
        </Input.Root>

        <Input.Root>
          <Input.Label required notSave={dirtyFields.endDate}>
            Data final
          </Input.Label>
          <Input.Field
            type="datetime-local"
            autoComplete="off"
            defaultValue={endDate ? DateTime.getIsoDateTime(endDate) : ''}
            disabled={isSubmitting}
            error={!!errors.endDate}
            {...register('endDate')}
            notSave={dirtyFields.endDate}
          />
          {errors.endDate && (
            <Input.Message error>{errors.endDate.message}</Input.Message>
          )}
        </Input.Root>
      </section>
    </Form>
  )
}
