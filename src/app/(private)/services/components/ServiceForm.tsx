'use client'

import { Input } from '@/components/input'
import Form, { FormProps } from '@/components/form/Form'
import { sectionStyles } from '@/components/form/Styles'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import useSnackbarContext from '@/hooks/useSnackbarContext copy'
import { ServiceResponse } from '@/services/service/Service'
import { responseError } from '@/services/api/api'
import { Currency } from '@/utils/Currency'

import Duration from '@/app/(private)/components/Duration'
import { Validate } from '@/services/api/Validate'

const setServiceSchema = z.object({
  name: z.string().min(1, 'Campo obrigatório'),
  value: z
    .string()
    .transform((value) => value.replace('.', '').replace(',', '.'))
    .refine((value) => +value > 0, {
      message: 'A o valor precisa ser um número positivo',
    }),
  duration: z.coerce.number().optional(),
})

export type setServiceData = z.infer<typeof setServiceSchema>

type ServiceFormProps = {
  action(
    data: ServiceResponse | setServiceData,
  ): Promise<ServiceResponse | responseError>
  formData?: Partial<ServiceResponse>
  afterValidation?(): void
} & FormProps

export default function ServiceForm({
  formData,
  afterValidation,
  action,
  ...formProps
}: ServiceFormProps) {
  const { name, id, duration, value } = formData || {}
  const { handleMessage } = useSnackbarContext()

  const setServiceForm = useForm<setServiceData>({
    resolver: zodResolver(setServiceSchema),
  })

  const {
    handleSubmit,
    formState: { isSubmitting, errors, dirtyFields },
    register,
    reset,
    setValue,
  } = setServiceForm

  const setService = async (data: setServiceData) => {
    const res = await action({
      id,
      duration: data.duration || duration,
      ...data,
    })
    if (Validate.isError(res)) {
      handleMessage({ title: 'Erro!', description: res.message, type: 'error' })
    } else {
      reset({ ...data }, { keepValues: true })
      if (afterValidation) afterValidation()
      handleMessage({
        title: 'Serviço salvo com sucesso!',
        type: 'success',
      })
    }
  }

  return (
    <Form onSubmit={handleSubmit(setService)} {...formProps}>
      <section aria-label="Diagnóstico do paciente" className={sectionStyles()}>
        <Input.Root>
          <Input.Label required notSave={dirtyFields.name}>
            Nome
          </Input.Label>
          <Input.Field
            autoComplete="off"
            disabled={isSubmitting}
            defaultValue={name}
            error={!!errors.name}
            {...register('name')}
            notSave={dirtyFields.name}
          />
          {errors.name && (
            <Input.Message error>{errors.name.message}</Input.Message>
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
          <Input.Label required notSave={dirtyFields.value}>
            Valor
          </Input.Label>
          <Input.Field
            startAdornment={<span className="pl-2">R$</span>}
            autoComplete="off"
            disabled={isSubmitting}
            defaultValue={Currency.format(value?.toFixed(2).toString() || '0')}
            {...register('value')}
            error={!!errors.value}
            notSave={dirtyFields.value}
            onChange={(e) => setValue('value', Currency.format(e.target.value))}
          />
          {errors.value && (
            <Input.Message error>{errors.value.message}</Input.Message>
          )}
        </Input.Root>
      </section>
    </Form>
  )
}
