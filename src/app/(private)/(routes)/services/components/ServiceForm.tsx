'use client'

import { Input } from '@/components/formField'
import Form, { FormProps } from '@/components/form/Form'
import { sectionStyles } from '@/components/form/Styles'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { UseFormSetValue, useForm } from 'react-hook-form'
import useSnackbarContext from '@/hooks/useSnackbarContext copy'
import { ServiceResponse } from '@/services/service/Service'
import { responseError } from '@/services/api/api'
import { Currency } from '@/utils/Currency'
import Button from '@/components/Button'
import { IoChevronUp } from 'react-icons/io5'
import { ChangeEvent, useReducer, useState } from 'react'

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
  ): Promise<ServiceResponse & responseError>
  formData?: Partial<ServiceResponse>
  afterValidation?(): void
} & FormProps

type timeState = {
  hours: number
  minutes: number
}

type TimeAction = {
  setValue: UseFormSetValue<{
    name: string
    value: string
    duration?: number
  }>
} & (
  | { type: 'incHour' }
  | { type: 'decHour' }
  | { type: 'changeHour'; value: number }
  | { type: 'incMinute' }
  | { type: 'decMinute' }
  | { type: 'changeMinute'; value: number }
)

const reducer = (state: timeState, action: TimeAction) => {
  switch (action.type) {
    case 'incHour':
      action.setValue(
        'duration',
        (state.hours + 1) * 60 * 60 + state.minutes * 60,
      )
      return {
        ...state,
        hours: state.hours + 1,
      }
    case 'decHour':
      action.setValue(
        'duration',
        (state.hours - 1) * 60 * 60 + state.minutes * 60,
      )
      return {
        ...state,
        hours: state.hours - 1,
      }
    case 'changeHour':
      action.setValue('duration', action.value * 60 * 60 + state.minutes * 60)
      return {
        ...state,
        hours: action.value,
      }

    case 'incMinute':
      action.setValue(
        'duration',
        state.hours * 60 * 60 + (state.minutes + 1) * 60,
      )
      return {
        ...state,
        minutes: state.minutes + 1,
      }
    case 'decMinute':
      action.setValue(
        'duration',
        state.hours * 60 * 60 + (state.minutes - 1) * 60,
      )
      return {
        ...state,
        minutes: state.minutes - 1,
      }
    case 'changeMinute':
      action.setValue('duration', state.hours * 60 * 60 + action.value * 60)
      return {
        ...state,
        minutes: action.value,
      }
    default:
      return state
  }
}

export default function ServiceForm({
  formData,
  afterValidation,
  action,
  ...formProps
}: ServiceFormProps) {
  const { name, id, duration, value } = formData || {}
  const { handleMessage } = useSnackbarContext()
  const [otherDuration, setOtherDuration] = useState(
    duration !== 60 * 60 && duration !== 30 * 60,
  )
  const [time, dispatch] = useReducer(reducer, {
    hours: duration ? Math.floor(duration / (60 * 60)) : 0,
    minutes: duration ? (duration % (60 * 60)) / 60 : 0,
  })
  const onlyNumber = (value: string) => {
    return value.replace(/\D/g, '')
  }
  const incrementHour = () => dispatch({ type: 'incHour', setValue })
  const decrementHour = () =>
    time.hours > 0 && dispatch({ type: 'decHour', setValue })

  const changeHour = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    dispatch({
      type: 'changeHour',
      value: +onlyNumber(e.target.value),
      setValue,
    })
  const incrementMinute = () => dispatch({ type: 'incMinute', setValue })
  const decrementMinute = () =>
    time.minutes > 0 && dispatch({ type: 'decMinute', setValue })

  const changeMinute = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) =>
    dispatch({
      type: 'changeMinute',
      value: +onlyNumber(e.target.value),
      setValue,
    })

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
      duration: data.duration || time.hours * 60 * 60 + time.minutes * 60,
      ...data,
    })
    if (res.error) {
      handleMessage({ title: 'Erro!', description: res.message, type: 'error' })
    } else {
      reset({ ...data })
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

        <Input.Root>
          <Input.Label notSave={dirtyFields.duration}>Duração</Input.Label>
          <div className="flex gap-2">
            <Button
              type="button"
              color="blue"
              className="w-14 px-0"
              variant={
                time.hours * 60 * 60 + time.minutes === 60 * 60 * 1 // 1 hour
                  ? 'solid'
                  : 'outline'
              }
              onClick={() => {
                dispatch({ type: 'changeHour', value: 1, setValue })
                dispatch({ type: 'changeMinute', value: 0, setValue })
                setOtherDuration(false)
              }}
            >
              1h
            </Button>
            <Button
              type="button"
              color="blue"
              className="w-14 px-0"
              variant={
                time.hours * 60 * 60 + time.minutes === 30 ? 'solid' : 'outline'
              }
              onClick={() => {
                dispatch({ type: 'changeHour', value: 0, setValue })
                dispatch({ type: 'changeMinute', value: 30, setValue })
                setOtherDuration(false)
              }}
            >
              30min
            </Button>

            {otherDuration ? (
              <>
                <div className="grid h-full grid-flow-col flex-col gap-x-1">
                  <Input.Field
                    className="row-span-2 w-12 max-w-[48px]"
                    autoComplete="off"
                    slotProps={{ input: { className: 'w-full pr-0' } }}
                    endAdornment={<span className="pr-2">h</span>}
                    onChange={changeHour}
                    value={time.hours}
                  />
                  <IoChevronUp
                    onClick={incrementHour}
                    className="h-full cursor-pointer rounded-t border-l border-r border-t  bg-slate-100 p-0.5 hover:bg-slate-200"
                  />
                  <IoChevronUp
                    onClick={decrementHour}
                    className="h-full rotate-180 cursor-pointer rounded-t border-l border-r border-t bg-slate-100 p-0.5 hover:bg-slate-200"
                  />
                </div>

                <div className="grid h-full grid-flow-col flex-col gap-x-1">
                  <Input.Field
                    className="row-span-2 w-16 max-w-[64px]"
                    autoComplete="off"
                    slotProps={{
                      input: { className: 'w-full pr-0' },
                    }}
                    endAdornment={<span className="pr-2">min</span>}
                    onChange={changeMinute}
                    value={time.minutes}
                  />
                  <IoChevronUp
                    onClick={incrementMinute}
                    className="h-full cursor-pointer rounded-t border-l border-r border-t  bg-slate-100 p-0.5 hover:bg-slate-200"
                  />
                  <IoChevronUp
                    onClick={decrementMinute}
                    className="h-full rotate-180 cursor-pointer rounded-t border-l border-r border-t bg-slate-100 p-0.5 hover:bg-slate-200"
                  />
                </div>
              </>
            ) : (
              <Button
                onClick={() => setOtherDuration(true)}
                type="button"
                variant="outline"
                color="blue"
              >
                Outra
              </Button>
            )}
          </div>
        </Input.Root>

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
