'use client'

import { Input } from '@/components/input'
import Form, { FormProps } from '@/components/form/Form'
import { sectionStyles } from '@/components/form/Styles'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import useSnackbarContext from '@/hooks/useSnackbarContext'

import DateTime from '@/utils/Date'
import { responseError } from '@/services/api/api'
import {
  listEventSuggestions,
  SaveBlockEvent,
} from '@/services/scheduling/scheduling'
import { Validate } from '@/services/api/Validate'

const setEventSchema = z.object({
  date: z.string().min(1, { message: 'Campo obrigatório' }),
  endDate: z.string().min(1, { message: 'Campo obrigatório' }),
  description: z.string(),
})

export type setEventData = z.infer<typeof setEventSchema>

type EventFormProps = {
  formData?: Partial<setEventData & { id: string }>
  afterValidation?(): void
  action(
    data: SaveBlockEvent & { id?: string },
  ): Promise<unknown | responseError>
} & FormProps

export default function EventForm({
  formData,
  action,
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
    setError,
    reset,
  } = setEventForm

  const setEvent = async (data: setEventData) => {
    const res = await action({ ...data, id: formData?.id })

    if (Validate.isError(res)) {
      if (res.type) {
        setError(res.type as keyof setEventData, {
          message: res.message,
        })
      } else
        handleMessage({
          title: 'Erro!',
          description: res.message,
          type: 'error',
        })
    } else {
      reset({ ...data }, { keepValues: true })
      if (afterValidation) afterValidation()
      handleMessage({
        title: 'Evento atualizado com sucesso!',
        type: 'success',
      })
    }
  }

  return (
    <Form onSubmit={handleSubmit(setEvent)} {...formProps}>
      <section aria-label="Diagnóstico do paciente" className={sectionStyles()}>
        <Input.Root>
          <Input.Label notSave={dirtyFields.description}>Descrição</Input.Label>
          <Input.AsyncAutocomplete
            {...register('description')}
            defaultValue={formData?.description}
            autoComplete="off"
            disabled={isSubmitting}
            error={!!errors.description}
            notSave={dirtyFields.description}
            searchTerm={async () => {
              const res = await listEventSuggestions()

              if (Validate.isError(res)) {
                return []
              }

              return res.data.map((item) => ({
                label: item.description,
                data: item,
              }))
            }}
          />
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
