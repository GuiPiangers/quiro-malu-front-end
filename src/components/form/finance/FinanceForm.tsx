'use client'

import { Input } from '@/components/input'
import { Validate } from '@/services/api/Validate'
import { Currency } from '@/utils/Currency'
import Form, { FormProps } from '../Form'
import { sectionStyles } from '../Styles'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import useSnackbarContext from '@/hooks/useSnackbarContext'
import { FinanceResponse } from '@/services/finance/Finance'
import { responseError } from '@/services/api/api'
import { z } from 'zod'

export const setFinanceSchema = z.object({
  description: z.string().min(1, 'Campo obrigatório'),
  value: z
    .string()
    .transform((value) => value.replace('.', '').replace(',', '.'))
    .refine((value) => +value > 0, {
      message: 'A o valor precisa ser um número positivo',
    }),
  type: z.enum(['income', 'expense']),
  date: z.string(),
  patientId: z.string().optional(),
  paymentMethod: z.string().optional(),
})

export type setFinanceData = z.infer<typeof setFinanceSchema>

type FinanceFormProps = {
  action(
    data: FinanceResponse | setFinanceData,
  ): Promise<FinanceResponse | responseError>
  formData?: Partial<FinanceResponse>
  afterValidation?(): void
} & FormProps

export default function FinanceForm({
  formData,
  afterValidation,
  action,
  ...formProps
}: FinanceFormProps) {
  const { date, description, patientId, paymentMethod, type, id, value } =
    formData || {}
  const { handleMessage } = useSnackbarContext()

  const setFinanceForm = useForm<setFinanceData>({
    resolver: zodResolver(setFinanceSchema),
  })

  const {
    handleSubmit,
    formState: { isSubmitting, errors, dirtyFields },
    register,
    reset,
    setValue,
  } = setFinanceForm

  const setFinance = async (data: setFinanceData) => {
    const res = await action({
      id,
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
    <Form onSubmit={handleSubmit(setFinance)} {...formProps}>
      <section
        aria-label="Novo registro financeiro"
        className={sectionStyles()}
      >
        <Input.Root>
          <Input.Label required notSave={dirtyFields.date}>
            Data
          </Input.Label>
          <Input.Field
            autoComplete="off"
            disabled={isSubmitting}
            defaultValue={date}
            error={!!errors.date}
            type="datetime-local"
            {...register('date')}
            notSave={dirtyFields.date}
          />
          {errors.date && (
            <Input.Message error>{errors.date.message}</Input.Message>
          )}
        </Input.Root>

        <Input.Root>
          <Input.Label required notSave={dirtyFields.description}>
            Descrição
          </Input.Label>
          <Input.Field
            autoComplete="off"
            disabled={isSubmitting}
            defaultValue={description}
            error={!!errors.description}
            {...register('description')}
            notSave={dirtyFields.description}
          />
          {errors.description && (
            <Input.Message error>{errors.description.message}</Input.Message>
          )}
        </Input.Root>

        <Input.Root>
          <Input.Label required notSave={dirtyFields.value}>
            Valor
          </Input.Label>
          <Input.Field
            startAdornment={<span className="pl-2">R$</span>}
            autoComplete="off"
            disabled={isSubmitting}
            defaultValue={Currency.format(value ?? 0)}
            {...register('value', {
              onChange(e) {
                setValue('value', Currency.format(e.target.value))
              },
            })}
            error={!!errors.value}
            notSave={dirtyFields.value}
          />
          {errors.value && (
            <Input.Message error>{errors.value.message}</Input.Message>
          )}
        </Input.Root>

        <Input.Root>
          <Input.Label required notSave={dirtyFields.type}>
            Tipo
          </Input.Label>
          <Input.Select
            onChange={(_, value) =>
              setValue('type', value as 'income' | 'expense')
            }
            defaultValue={type}
            disabled={isSubmitting}
            error={!!errors.type}
            notSave={dirtyFields.type}
            slotProps={{
              popper: { className: 'z-40' },
            }}
          >
            <Input.Option value="income">Receita</Input.Option>
            <Input.Option value="expense">Despesa</Input.Option>
          </Input.Select>
          {errors.type && (
            <Input.Message error>{errors.type.message}</Input.Message>
          )}
        </Input.Root>

        <Input.Root>
          <Input.Label notSave={dirtyFields.paymentMethod}>
            Forma de pagamento
          </Input.Label>
          <Input.Select
            onChange={(_, value) => setValue('paymentMethod', value as string)}
            disabled={isSubmitting}
            defaultValue={paymentMethod}
            error={!!errors.paymentMethod}
            notSave={dirtyFields.paymentMethod}
            slotProps={{
              popper: { className: 'z-40' },
            }}
          >
            <Input.Option value="money">Dinheiro</Input.Option>
            <Input.Option value="pix">PIX</Input.Option>
            <Input.Option value="creditCard">Crédito</Input.Option>
            <Input.Option value="creditCard">Débito</Input.Option>
          </Input.Select>
          {errors.paymentMethod && (
            <Input.Message error>{errors.paymentMethod.message}</Input.Message>
          )}
        </Input.Root>
      </section>
    </Form>
  )
}
