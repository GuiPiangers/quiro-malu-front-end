'use client'

import { Input } from '@/components/input'
import Form, { FormProps } from '../../../../../../components/form/Form'
import { sectionStyles } from '../../../../../../components/form/Styles'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import useSnackbarContext from '@/hooks/useSnackbarContext'
import { ProgressResponse } from '@/services/patient/patient'
import DateTime from '@/utils/Date'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Validate } from '@/services/api/Validate'
import { responseError } from '@/services/api/api'
import { TextEditor } from '@/components/TextEditor'
import Button from '@/components/Button'
import PainScale from '@/components/painScale/PainScale'
import { Trash } from 'lucide-react'
import { AudioRecorder } from '@/components/AudioRecorder'
import { useAudioTranscriber } from '@/hooks/useAudioTranscriber'
import { useSearchParams } from 'next/navigation'
import {
  ClinicianServiceItem,
  listClinicians,
} from '@/services/clinicUsers/clinicUsers'
import ClinicianSelectField, {
  ClinicianOptionContent,
} from '@/app/(private)/scheduling/components/ClinicianSelectField'
import { useQuery } from '@tanstack/react-query'

const painScaleSchema = z.object({
  description: z.string(),
  painLevel: z.number(),
})

export const setProgressSchema = z.object({
  userId: z.string().min(1, { message: 'Selecione o profissional' }),
  actualProblem: z.string().optional(),
  procedures: z.string().optional(),
  service: z.string().min(1, { message: 'Campo obrigatório' }),
  date: z.string().min(1, { message: 'Campo obrigatório' }),
  painScales: z.array(painScaleSchema).optional(),
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
  const { patientId, date, service, id, userId: formUserId } = formData
  const searchParams = useSearchParams()
  const defaultUserId = formUserId ?? searchParams.get('userId') ?? ''
  const isEditing = !!id
  const [actualProblem, setActualProblem] = useState<string>(
    formData?.actualProblem ?? '',
  )
  const [procedures, setProcedures] = useState<string>(
    formData?.procedures ?? '',
  )

  const [selectedService, setSelectedService] = useState<ClinicianServiceItem>()
  const {
    isPending: isActualProblemTranscribing,
    data: actualProblemTranscription,
    mutateAsync: actualProblemTranscribe,
  } = useAudioTranscriber({
    onSuccess: (data) => {
      setActualProblem(data.text)
      setValue('actualProblem', data.text, {
        shouldDirty: true,
        shouldTouch: true,
      })
    },
  })

  const {
    isPending: isProceduresTranscribing,
    data: proceduresTranscription,
    mutate: proceduresTranscribe,
  } = useAudioTranscriber()

  const { handleMessage } = useSnackbarContext()

  const setProgressForm = useForm<setProgressData>({
    resolver: zodResolver(setProgressSchema),
    values: {
      actualProblem: formData.actualProblem ?? '',
      date: formData.date ?? '',
      procedures: formData.procedures ?? '',
      service: formData.service ?? '',
      userId: defaultUserId,
      painScales: formData.painScales ?? [],
    },
    defaultValues: {
      actualProblem: formData.actualProblem ?? '',
      date: formData.date ?? '',
      procedures: formData.procedures ?? '',
      service: formData.service ?? '',
      userId: defaultUserId,
      painScales: formData.painScales ?? [],
    },
  })

  const {
    handleSubmit,
    formState: { isSubmitting, errors, dirtyFields },
    register,
    setValue,
    control,
    watch,
  } = setProgressForm

  const userId = watch('userId')

  const { data: clinicians } = useQuery({
    queryKey: ['clinicians'],
    queryFn: async () => {
      const result = await listClinicians()
      if (Validate.isError(result)) throw new Error(result.message)
      return result
    },
  })

  const clinicianName = useMemo(
    () => clinicians?.find((c) => c.id === userId)?.name,
    [clinicians, userId],
  )

  const clinicianServices = useMemo(
    () =>
      clinicians?.find((clinician) => clinician.id === userId)?.services ?? [],
    [clinicians, userId],
  )

  const selectService = useCallback(
    (value: ClinicianServiceItem) => {
      setSelectedService(value)
      setValue('service', value.name, {
        shouldDirty: true,
        shouldValidate: true,
      })
    },
    [setValue],
  )

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: 'painScales',
  })

  const painScalesFromProps = useMemo(
    () => formData.painScales ?? [],
    [formData.painScales],
  )
  const painScalesKey = useMemo(
    () => JSON.stringify(painScalesFromProps),
    [painScalesFromProps],
  )

  useEffect(() => {
    replace(painScalesFromProps)
  }, [painScalesKey, replace, painScalesFromProps])

  const setProgress = async (data: setProgressData) => {
    const hasDirtyFields = Object.keys(dirtyFields).length > 0

    const res =
      hasDirtyFields || !isEditing
        ? await formAction({
            id: id ?? '',
            patientId: patientId!,
            ...data,
          })
        : undefined

    if (res && Validate.isError(res)) {
      handleMessage({ title: 'Erro!', description: res.message, type: 'error' })
    } else {
      if (afterValidation) afterValidation()
      else {
        handleMessage({
          title: 'Evolução salva com sucesso!',
          type: 'success',
        })
      }
    }
  }

  useEffect(() => {
    const newText = actualProblemTranscription?.text
    setActualProblem(newText)
    setValue('actualProblem', newText, {
      shouldDirty: true,
    })
  }, [actualProblemTranscription])

  useEffect(() => {
    const newText = proceduresTranscription?.text

    setProcedures(newText)
    setValue('procedures', newText, {
      shouldDirty: true,
    })
  }, [proceduresTranscription])

  useEffect(() => {
    if (isEditing || !clinicians?.length || userId) return
    setValue('userId', clinicians[0].id, { shouldValidate: true })
  }, [clinicians, isEditing, setValue, userId])

  useEffect(() => {
    if (!service || !clinicianServices.length) return
    const match = clinicianServices.find((item) => item.name === service)
    if (match) selectService(match)
  }, [service, clinicianServices, selectService])

  useEffect(() => {
    if (!selectedService) return
    const stillAvailable = clinicianServices.some(
      (item) => item.id === selectedService.id,
    )
    if (!stillAvailable) {
      setSelectedService(undefined)
      setValue('service', '', { shouldValidate: true })
    }
  }, [clinicianServices, selectedService, setValue])

  const serviceSelectPlaceholder = !userId
    ? 'Selecione o profissional primeiro'
    : clinicianServices.length === 0
    ? 'Nenhum serviço vinculado a este profissional'
    : 'Selecione o serviço'

  return (
    <Form onSubmit={handleSubmit(setProgress)} {...formProps}>
      <section
        aria-label="Evolução do paciente"
        className={sectionStyles({
          className: 'max-h-[80lvh] overflow-y-auto',
        })}
      >
        <Input.Root>
          <Input.Label required={!isEditing} notSave={dirtyFields.userId}>
            Profissional
          </Input.Label>
          {isEditing ? (
            <>
              <input type="hidden" {...register('userId')} />
              <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                {clinicianName ? (
                  <ClinicianOptionContent name={clinicianName} />
                ) : (
                  <span className="text-sm text-slate-500">
                    Profissional não encontrado
                  </span>
                )}
              </div>
            </>
          ) : (
            <>
              <ClinicianSelectField
                clinicians={clinicians ?? []}
                value={userId}
                disabled={isSubmitting}
                error={!!errors.userId}
                onChange={(value) => {
                  setValue('userId', value, {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                  setSelectedService(undefined)
                  setValue('service', '', { shouldValidate: true })
                }}
              />
              {errors.userId && (
                <Input.Message error>{errors.userId.message}</Input.Message>
              )}
            </>
          )}
        </Input.Root>

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
            value={selectedService?.id ?? ''}
            disabled={isSubmitting || !userId || clinicianServices.length === 0}
            error={!!errors.service}
            notSave={dirtyFields.service}
            slotProps={{ popper: { className: 'z-40' } }}
            onChange={(_, selected) => {
              const clinicianService = clinicianServices.find(
                (item) => item.id === selected,
              )
              if (clinicianService) selectService(clinicianService)
            }}
            renderValue={() =>
              selectedService?.name ?? (
                <span className="text-slate-500">
                  {serviceSelectPlaceholder}
                </span>
              )
            }
          >
            {clinicianServices.map((clinicianService) => (
              <Input.Option
                key={clinicianService.id}
                value={clinicianService.id}
              >
                {clinicianService.name}
              </Input.Option>
            ))}
          </Input.Select>

          {errors.service && (
            <Input.Message error>{errors.service.message}</Input.Message>
          )}
        </Input.Root>

        <Input.Root>
          <Input.Label>Problema atual</Input.Label>
          <TextEditor.Root
            disabled={isActualProblemTranscribing}
            content={actualProblem}
            onChange={(html) => {
              setValue('actualProblem', html, { shouldDirty: true })
              setActualProblem(html)
            }}
          >
            <TextEditor.Header />
            {isActualProblemTranscribing && (
              <div className="prose prose-sm p-3">
                <p>Transcrevendo áudio...</p>
              </div>
            )}
            <TextEditor.Editor
              className={isActualProblemTranscribing ? `invisible` : ''}
            />
            <div className="flex w-full items-center justify-end gap-2 px-3 pb-3">
              <AudioRecorder
                disabled={isActualProblemTranscribing}
                onRecordComplete={(blob) => {
                  actualProblemTranscribe(blob)
                }}
              />
            </div>
          </TextEditor.Root>
          {errors.actualProblem && (
            <Input.Message error>{errors.actualProblem.message}</Input.Message>
          )}
        </Input.Root>

        <Input.Root>
          <Input.Label>Procedimentos</Input.Label>
          <TextEditor.Root
            content={procedures}
            disabled={isProceduresTranscribing}
            onChange={(html) => {
              setValue('procedures', html, { shouldDirty: true })
            }}
          >
            <TextEditor.Header />
            {isProceduresTranscribing && (
              <div className="prose prose-sm p-3">
                <p>Transcrevendo áudio...</p>
              </div>
            )}
            <TextEditor.Editor
              className={isProceduresTranscribing ? `invisible` : ''}
            />
            <div className="flex w-full items-center justify-end gap-2 p-3">
              <AudioRecorder
                disabled={isProceduresTranscribing}
                onRecordComplete={(blob) => {
                  proceduresTranscribe(blob)
                }}
              />
            </div>
          </TextEditor.Root>
          {errors.procedures && (
            <Input.Message error>{errors.procedures.message}</Input.Message>
          )}
        </Input.Root>
        <div className="mt-4 space-y-4">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="relative flex flex-col gap-4 rounded-lg border p-4"
            >
              <Button
                type="button"
                variant="ghost"
                color="red"
                className="absolute right-2 top-2 h-auto p-1"
                onClick={() => remove(index)}
              >
                <Trash size={18} />
              </Button>
              <Input.Root>
                <Input.Label>Descrição da dor</Input.Label>
                <Input.Field
                  {...register(`painScales.${index}.description`)}
                  placeholder="Ex: Dor na lombar"
                />
              </Input.Root>

              <Controller
                control={control}
                name={`painScales.${index}.painLevel`}
                defaultValue={field.painLevel}
                render={({ field: { onChange, value } }) => (
                  <PainScale
                    value={value}
                    onChange={onChange}
                    defaultValue={5}
                  />
                )}
              />
            </div>
          ))}
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={() => append({ description: '', painLevel: 5 })}
          className="mt-4"
        >
          Adicionar escala de dor
        </Button>
      </section>
    </Form>
  )
}
