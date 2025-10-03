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
import { useState } from 'react'
import { ServiceResponse } from '@/services/service/Service'
import { Validate } from '@/services/api/Validate'
import { responseError } from '@/services/api/api'
import ServiceSelect from '@/components/input/select/ServiceSelect'
import { TextEditor } from '@/components/TextEditor'
import Button from '@/components/Button'
import PainScale from '@/components/painScale/PainScale'
import { Trash } from 'lucide-react'

const painScaleSchema = z.object({
  description: z.string(),
  painLevel: z.number(),
})

export const setProgressSchema = z.object({
  actualProblem: z.string(),
  procedures: z.string(),
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
  const { patientId, actualProblem, date, procedures, service, id } = formData
  const [serviceData, setService] = useState<ServiceResponse>()

  const { handleMessage } = useSnackbarContext()
  const setProgressForm = useForm<ProgressResponse>({
    resolver: zodResolver(setProgressSchema),
    values: {
      actualProblem: formData.actualProblem ?? '',
      date: formData.date ?? '',
      procedures: formData.procedures ?? '',
      service: formData.service ?? '',
      id: formData.id ?? '',
      patientId: formData.patientId ?? '',
      painScales: formData.painScales ?? [],
    },
  })

  const {
    handleSubmit,
    formState: { isSubmitting, errors, dirtyFields },
    register,
    setValue,
    control,
  } = setProgressForm

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'painScales',
  })

  const setProgress = async (data: setProgressData) => {
    const hasDirtyFields = Object.keys(dirtyFields).length > 0

    console.log(data)

    const res = hasDirtyFields
      ? await formAction({
          id: id!,
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

  return (
    <Form onSubmit={handleSubmit(setProgress)} {...formProps}>
      <section
        aria-label="Evolução do paciente"
        className={sectionStyles({
          className: 'max-h-[80lvh] overflow-y-auto',
        })}
      >
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
          <ServiceSelect
            disabled={isSubmitting}
            defaultValue={service}
            value={serviceData}
            error={!!errors.service}
            slotProps={{ popper: { className: 'z-40' } }}
            onChange={(_, newValue) => {
              setValue('service', (newValue as ServiceResponse).name, {
                shouldDirty: true,
              })
              setService(newValue as ServiceResponse)
            }}
            onInitialize={(service: ServiceResponse) => {
              service &&
                setValue('service', service.name, {
                  shouldDirty: true,
                })
              setService(service)
            }}
          />

          {errors.service && (
            <Input.Message error>{errors.service.message}</Input.Message>
          )}
        </Input.Root>

        <Input.Root>
          <Input.Label notSave={dirtyFields.actualProblem}>
            Problema atual
          </Input.Label>
          <TextEditor
            content={actualProblem}
            onChange={(html) => {
              setValue('actualProblem', html, { shouldDirty: true })
            }}
          />
          {errors.actualProblem && (
            <Input.Message error>{errors.actualProblem.message}</Input.Message>
          )}
        </Input.Root>

        <Input.Root>
          <Input.Label notSave={dirtyFields.procedures}>
            Procedimentos
          </Input.Label>
          <TextEditor
            content={procedures}
            onChange={(html) => {
              setValue('procedures', html, { shouldDirty: true })
            }}
          />
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
