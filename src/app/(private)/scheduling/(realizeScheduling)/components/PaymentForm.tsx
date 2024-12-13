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
import ServiceSelect from '@/components/input/ServiceSelect'
import { PageStage } from './RealizeScheduling'
import { ServiceResponse } from '@/services/service/service'
import { useRef, useState } from 'react'

export const setPaymentSchema = z.object({
  date: z.string(),
  price: z
    .string()
    .transform((value) => value.replace('.', '').replace(',', '.'))
    .refine((value) => +value > 0, {
      message: 'A o valor precisa ser um número positivo',
    }),
  paymentMethod: z.string().optional(),
  service: z
    .object({
      id: z.string().optional(),
      name: z.string(),
      value: z.number(),
      duration: z.number(),
    })
    .optional(),
})

type PaymentResponse = {
  date: string
  price: string
  paymentMethod?: string
  service: string
}
export type setPaymentData = z.infer<typeof setPaymentSchema>

type PaymentFormProps = {
  formData?: Partial<PaymentResponse>
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

  const setPaymentForm = useForm<setPaymentData>({
    resolver: zodResolver(setPaymentSchema),
  })
  const buttonClicked = useRef<'voltar' | 'finalizar'>('voltar')

  const {
    handleSubmit,
    formState: { isSubmitting, errors, dirtyFields },
    register,
    setValue,
  } = setPaymentForm

  const setPayment = () => {
    afterValidation && afterValidation(buttonClicked.current)
    goNextPage()
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
          <Input.Label notSave={dirtyFields.service?.name}>Serviço</Input.Label>
          <ServiceSelect
            notSave={dirtyFields.service?.name}
            defaultValue={formData?.service}
            onInitialize={(value) => {
              setValue('service', value as ServiceResponse, {
                shouldDirty: true,
              })
              setSelectedService(value as ServiceResponse)
              value &&
                setValue(
                  'price',
                  Currency.format(value ? value.value.toFixed(2) : '0'),
                )
            }}
            value={selectedService}
            onChange={(_, value) => {
              setSelectedService(value as ServiceResponse)
              setValue('service', value as ServiceResponse, {
                shouldDirty: true,
              })
              setValue(
                'price',
                Currency.format(
                  value ? (value as ServiceResponse).value.toFixed(2) : '0',
                ),
              )
            }}
          />
          {errors.service && (
            <Input.Message error>{errors.service.message}</Input.Message>
          )}
        </Input.Root>

        <div className="flex gap-4">
          <Input.Root>
            <Input.Label notSave={dirtyFields.price}>Valor</Input.Label>
            <Input.Field
              startAdornment={<span className="pl-2">R$</span>}
              autoComplete="off"
              disabled={isSubmitting}
              {...register('price')}
              error={!!errors.price}
              notSave={dirtyFields.price}
              onChange={(e) =>
                setValue('price', Currency.format(e.target.value))
              }
            />
            {errors.price && (
              <Input.Message error>{errors.price.message}</Input.Message>
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
