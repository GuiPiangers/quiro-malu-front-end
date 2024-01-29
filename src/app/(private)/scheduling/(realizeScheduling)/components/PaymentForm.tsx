'use client'

import { Input } from '@/components/input'
import Form, {FormProps} from '@/components/form/Form'
import { sectionStyles } from '@/components/form/Styles' 
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import useSnackbarContext from '@/hooks/useSnackbarContext copy'
import { Dispatch, SetStateAction, useEffect } from 'react'
import Button from '@/components/Button'

export const setPaymentSchema = z.object({
  price: z.number(),
  PaymentMethod: z.string(),
})

type PaymentResponse = {
  price: number,
  paymentMethod?: string
}
export type setPaymentData = z.infer<typeof setPaymentSchema>


type PaymentFormProps = {
  formData: Partial<PaymentResponse>
  afterValidation?(): void
  handleFormState: Dispatch<SetStateAction<{
    progress: {};
    payment: {};
}>>
} & FormProps

export default function PaymentForm({
  formData,
  handleFormState,
  afterValidation,
  ...formProps
}: PaymentFormProps) {
  const { price, paymentMethod } = formData

  const { handleMessage } = useSnackbarContext()
  const setPaymentForm = useForm<PaymentResponse>({
    resolver: zodResolver(setPaymentSchema),
  })

  const {
    handleSubmit,
    formState: { isSubmitting, errors, dirtyFields },
    register,
    reset,
    setValue,
  } = setPaymentForm

  const setPayment = async (data: PaymentResponse) => {
      reset({ ...data })
      handleFormState(value => ({...value, payment: data, }))
      if (afterValidation) afterValidation()
 
  }
  useEffect(() => {
    setValue('price', formData.price || 0)
  }, [])

  return (
    <Form 
      {...formProps} 
      onSubmit={handleSubmit(setPayment)} 
      className='shadow-none' 
      btWrapperClassName='flex-row-reverse justify-between'
      buttons={
        <>
          <Button color='green'>Finalizar</Button>
          <Button color='black' variant='outline' type='button'>Voltar</Button>
        </>
      }
    >
      <section aria-label="Diagnóstico do paciente" className={sectionStyles({class: 'overflow-auto '})}>
      <Input.Root>
          <Input.Label notSave={dirtyFields.price}>
            Problema atual
          </Input.Label>
          <Input.Field
            autoComplete="off"
            disabled={isSubmitting}
            defaultValue={price}
            error={!!errors.price}
            {...register('price')}
            notSave={dirtyFields.price}
          />
          {errors.price && (
            <Input.Message error>{errors.price.message}</Input.Message>
          )}
        </Input.Root>

        <Input.Root>
          <Input.Label notSave={dirtyFields.paymentMethod}>
            Serviço
          </Input.Label>
          <Input.Select
            {...register('paymentMethod')}
            disabled={isSubmitting}
            defaultValue={paymentMethod}
            error={!!errors.paymentMethod}
            slotProps={{ popper: { className: 'z-40' } }}
            onChange={(_, newValue) => setValue('paymentMethod', newValue as string)}
          >
              <Input.Option value='Dinheiro'>Dinheiro</Input.Option>

              <Input.Option value='Pix'>Pix</Input.Option>

              <Input.Option value='Cartão'>Cartão</Input.Option>
          </Input.Select>

          {errors.paymentMethod && (
            <Input.Message error>{errors.paymentMethod.message}</Input.Message>
          )}
        </Input.Root>

      </section>
    </Form>
  )
}
