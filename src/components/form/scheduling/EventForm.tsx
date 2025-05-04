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
  dateStart: z.string().min(1, { message: 'Campo obrigatório' }),
  dateEnd: z.string().min(1, { message: 'Campo obrigatório' }),
  eventName: z.string(),
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
  const { dateStart, dateEnd } = formData || {}
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
          <Input.Field autoComplete="off" {...register('eventName')} />
          {errors.eventName && (
            <Input.Message error>{errors.eventName.message}</Input.Message>
          )}
        </Input.Root>

        <Input.Root>
          <Input.Label required notSave={dirtyFields.dateStart}>
            Data de início
          </Input.Label>
          <Input.Field
            type="datetime-local"
            autoComplete="off"
            defaultValue={dateStart ? DateTime.getIsoDateTime(dateStart) : ''}
            disabled={isSubmitting}
            error={!!errors.dateStart}
            {...register('dateStart')}
            notSave={dirtyFields.dateStart}
          />
          {errors.dateStart && (
            <Input.Message error>{errors.dateStart.message}</Input.Message>
          )}
        </Input.Root>

        <Input.Root>
          <Input.Label required notSave={dirtyFields.dateEnd}>
            Data final
          </Input.Label>
          <Input.Field
            type="datetime-local"
            autoComplete="off"
            defaultValue={dateEnd ? DateTime.getIsoDateTime(dateEnd) : ''}
            disabled={isSubmitting}
            error={!!errors.dateEnd}
            {...register('dateEnd')}
            notSave={dirtyFields.dateEnd}
          />
          {errors.dateEnd && (
            <Input.Message error>{errors.dateEnd.message}</Input.Message>
          )}
        </Input.Root>
      </section>
    </Form>
  )
}
