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
  EventsSuggestion,
} from '@/services/scheduling/scheduling'
import { Validate } from '@/services/api/Validate'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { listClinicians } from '@/services/clinicUsers/clinicUsers'
import ClinicianSelectField from '@/app/(private)/scheduling/components/ClinicianSelectField'

const setEventSchema = z.object({
  userId: z.string().min(1, { message: 'Selecione o profissional' }),
  date: z.string().min(1, { message: 'Campo obrigatório' }),
  endDate: z.string().min(1, { message: 'Campo obrigatório' }),
  description: z.string(),
})

export type setEventData = z.infer<typeof setEventSchema>

type EventFormProps = {
  formData?: Partial<setEventData & { id: string }>
  afterValidation?(): void
  action(data: setEventData & { id?: string }): Promise<unknown | responseError>
} & FormProps

export default function EventForm({
  formData,
  action,
  afterValidation,
  ...formProps
}: EventFormProps) {
  const { date, endDate, id } = formData || {}
  const searchParams = useSearchParams()
  const defaultUserId = formData?.userId ?? searchParams.get('userId') ?? ''
  const { handleMessage } = useSnackbarContext()

  const setEventForm = useForm<setEventData>({
    resolver: zodResolver(setEventSchema),
    defaultValues: {
      userId: defaultUserId,
      description: formData?.description || '',
    },
  })

  const {
    handleSubmit,
    formState: { isSubmitting, errors, dirtyFields },
    register,
    setError,
    reset,
    watch,
    setValue,
  } = setEventForm

  const userId = watch('userId')

  const { data: clinicians } = useQuery({
    queryKey: ['clinicians'],
    queryFn: async () => {
      const result = await listClinicians()
      if (Validate.isError(result)) throw new Error(result.message)
      return result
    },
  })

  const [selectedEvent, setSelectedEvent] = useState<{
    data: EventsSuggestion
  } | null>(null)
  const dateValue = watch('date')

  useEffect(() => {
    if (dateValue) {
      const newEndDate = new Date(dateValue)
      if (selectedEvent) {
        newEndDate.setMinutes(
          newEndDate.getMinutes() + selectedEvent?.data?.durationInMinutes,
        )
      } else {
        newEndDate.setHours(newEndDate.getHours() + 1)
      }
      setValue('endDate', DateTime.getIsoDateTime(newEndDate.toISOString()))
    }
  }, [dateValue, selectedEvent, setValue])

  useEffect(() => {
    if (!clinicians?.length || userId) return
    setValue('userId', clinicians[0].id, { shouldValidate: true })
  }, [clinicians, setValue, userId])

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
    }
  }

  return (
    <Form
      onSubmit={handleSubmit(setEvent)}
      {...formProps}
      className="border-none"
    >
      <section aria-label="Evento de bloqueio" className={sectionStyles()}>
        <Input.Root>
          <Input.Label required notSave={dirtyFields.userId}>
            Profissional
          </Input.Label>
          <ClinicianSelectField
            clinicians={clinicians ?? []}
            value={userId}
            disabled={isSubmitting}
            error={!!errors.userId}
            onChange={(value) =>
              setValue('userId', value, {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
          />
          {errors.userId && (
            <Input.Message error>{errors.userId.message}</Input.Message>
          )}
        </Input.Root>

        <Input.Root>
          <Input.Label notSave={dirtyFields.description}>Descrição</Input.Label>
          <Input.AsyncAutocomplete
            {...register('description')}
            defaultValue={formData?.description}
            autoComplete="off"
            disabled={isSubmitting}
            error={!!errors.description}
            notSave={dirtyFields.description}
            onSelectOption={(
              option: { data: EventsSuggestion; label: string } | null,
            ) => {
              setSelectedEvent(option)
            }}
            searchTerm={async (value) => {
              const res = await listEventSuggestions({ filter: value })

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
