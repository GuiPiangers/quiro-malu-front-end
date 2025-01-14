'use client'

import { Input } from '@/components/input'
import Form, { FormProps } from '@/components/form/Form'
import { sectionStyles } from '@/components/form/Styles'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import Button from '@/components/Button'
import { Currency } from '@/utils/Currency'
import DateTime from '@/utils/Date'
import ServiceSelect from '@/components/input/select/ServiceSelect'
import { PageStage } from './RealizeScheduling'
import { ServiceResponse } from '@/services/service/Service'
import { useRef, useState } from 'react'
import {
  createFinance,
  FinanceResponse,
  getBySchedulingFinance,
} from '@/services/finance/Finance'
import {
  setFinanceData,
  setFinanceSchema,
} from '@/components/form/finance/FinanceForm'
import { Validate } from '@/services/api/Validate'
import { useQuery } from '@tanstack/react-query'

// export const setPaymentSchema = z.object({
//   date: z.string(),
//   price: z
//     .string()
//     .transform((value) => value.replace('.', '').replace(',', '.'))
//     .refine((value) => +value > 0, {
//       message: 'A o valor precisa ser um número positivo',
//     }),
//   paymentMethod: z.string().optional(),
//   service: z
//     .object({
//       id: z.string().optional(),
//       name: z.string(),
//       value: z.number(),
//       duration: z.number(),
//     })
//     .optional(),
// })

// type PaymentResponse = {
//   date: string
//   price: string
//   paymentMethod?: string
//   service: string
// }
// export type setPaymentData = z.infer<typeof setPaymentSchema>

type PaymentFormProps = {
  formData?: Partial<FinanceResponse & { service: string }>
  afterValidation?(buttonClicked: string): void
  setNextPage: (page: PageStage) => void
  goNextPage: () => void
} & FormProps

export default function PaymentForm({
  formData,
  afterValidation,
  setNextPage,
  goNextPage,
  ...formProps
}: PaymentFormProps) {
  const [selectedService, setSelectedService] = useState<ServiceResponse>()

  console.log(formData?.schedulingId)

  const { data: financeData } = useQuery({
    queryKey: ['progress', { schedulingId: formData?.schedulingId ?? '' }],
    queryFn: async () =>
      formData?.schedulingId
        ? await getBySchedulingFinance(formData?.schedulingId).then((res) => {
            console.log(res)
            return Validate.isOk(res) ? res : undefined
          })
        : (() => undefined)(),
  })

  const setPaymentForm = useForm<setFinanceData>({
    resolver: zodResolver(setFinanceSchema),
    values: {
      type: 'income',
      description: financeData?.description || formData?.description || '',
      date: formData?.date || DateTime.getIsoDateTime(new Date()),
      value:
        Currency.format(financeData?.value || 0) ||
        Currency.format(formData?.value || 0),
      patientId: financeData?.patientId || formData?.patientId,
      paymentMethod: financeData?.paymentMethod || formData?.paymentMethod,
      service: financeData?.service || formData?.service,
      schedulingId: financeData?.schedulingId || formData?.schedulingId,
    },
  })
  const buttonClicked = useRef<'voltar' | 'finalizar'>('voltar')

  const {
    handleSubmit,
    formState: { isSubmitting, errors, dirtyFields },
    register,
    setValue,
  } = setPaymentForm

  const setPayment = async (data: setFinanceData) => {
    const result = await createFinance({
      ...data,
      value: +data.value,
      id: financeData?.id,
    })

    if (Validate.isOk(result)) {
      afterValidation && afterValidation(buttonClicked.current)
      goNextPage()
    }
  }

  return (
    <Form
      {...formProps}
      onSubmit={handleSubmit(setPayment)}
      className="shadow-none"
      btWrapperClassName="flex-row-reverse justify-between"
      buttons={
        <>
          <Button
            color="green"
            onClick={() => {
              buttonClicked.current = 'finalizar'
            }}
          >
            Finalizar
          </Button>
          <Button
            color="green"
            variant="outline"
            onClick={() => {
              buttonClicked.current = 'voltar'
              setNextPage('progress')
            }}
          >
            Voltar
          </Button>
        </>
      }
    >
      <section
        aria-label="Realizar consulta"
        className={sectionStyles({ class: 'overflow-auto ' })}
      >
        <Input.Root>
          <Input.Label required notSave={dirtyFields.date}>
            Data
          </Input.Label>
          <Input.Field
            autoComplete="off"
            disabled={isSubmitting}
            type="datetime-local"
            defaultValue={DateTime.getIsoDateTime(formData?.date || new Date())}
            error={!!errors.date}
            {...register('date')}
            notSave={dirtyFields.date}
          />
          {errors.date && (
            <Input.Message error>{errors.date.message}</Input.Message>
          )}
        </Input.Root>

        <Input.Root>
          <Input.Label>Serviço</Input.Label>
          <ServiceSelect
            defaultValue={formData?.service}
            onInitialize={(value: ServiceResponse) => {
              setSelectedService(value)
              value &&
                setValue(
                  'value',
                  Currency.format(value ? value.value.toFixed(2) : '0'),
                )
            }}
            value={selectedService}
            onChange={(_, value) => {
              setSelectedService(value as ServiceResponse)
              setValue(
                'value',
                Currency.format(
                  value ? (value as ServiceResponse).value.toFixed(2) : '0',
                ),
              )
            }}
          />
        </Input.Root>

        <div className="flex gap-4">
          <Input.Root>
            <Input.Label notSave={dirtyFields.value}>Valor</Input.Label>
            <Input.Field
              startAdornment={<span className="pl-2">R$</span>}
              autoComplete="off"
              disabled={isSubmitting}
              {...register('value')}
              error={!!errors.value}
              notSave={dirtyFields.value}
              onChange={(e) =>
                setValue('value', Currency.format(e.target.value))
              }
            />
            {errors.value && (
              <Input.Message error>{errors.value.message}</Input.Message>
            )}
          </Input.Root>

          <Input.Root>
            <Input.Label notSave={dirtyFields.paymentMethod}>
              Forma de pagamento
            </Input.Label>
            <Input.Select
              {...register('paymentMethod')}
              disabled={isSubmitting}
              defaultValue={formData?.paymentMethod}
              error={!!errors.paymentMethod}
              slotProps={{ popper: { className: 'z-40' } }}
              onChange={(_, newValue) =>
                setValue('paymentMethod', newValue as string)
              }
            >
              <Input.Option value="Dinheiro">Dinheiro</Input.Option>
              <Input.Option value="Pix">Pix</Input.Option>
              <Input.Option value="Cartão">Cartão</Input.Option>
            </Input.Select>
            {errors.paymentMethod && (
              <Input.Message error>
                {errors.paymentMethod.message}
              </Input.Message>
            )}
          </Input.Root>
        </div>
      </section>
    </Form>
  )
}
