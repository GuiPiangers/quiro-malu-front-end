/* eslint-disable react-hooks/rules-of-hooks */
'use client'

import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { PlusCircle, Trash } from 'lucide-react'

import Form from '@/components/form/Form'
import { Input } from '@/components/input'
import { Checkbox } from '@/components/ui/checkbox'
import Button from '@/components/Button'
import { setCalendarConfiguration } from '@/services/config/calendar/calendarConfiguration'
import useSnackbarContext from '@/hooks/useSnackbarContext'
import { getWeekDayKey } from '@/services/config/calendar/calendarUtils'

const workScheduleSchema = z.object({
  start: z.string().min(1, 'Obrigatório'),
  end: z.string().min(1, 'Obrigatório'),
})

const dayConfigurationSchema = z.object({
  workSchedules: z.array(workScheduleSchema),
  isActive: z.boolean().default(false).optional(),
})

const calendarConfigurationSchema = z.object({
  workTimeIncrementInMinutes: z.coerce.number().optional(),
  domingo: dayConfigurationSchema.optional(), // Domingo
  segunda: dayConfigurationSchema.optional(), // Segunda
  terca: dayConfigurationSchema.optional(), // Terça
  quarta: dayConfigurationSchema.optional(), // Quarta
  quinta: dayConfigurationSchema.optional(), // Quinta
  sexta: dayConfigurationSchema.optional(), // Sexta
  sabado: dayConfigurationSchema.optional(), // Sábado
})

type CalendarConfigurationData = z.infer<typeof calendarConfigurationSchema>

const weekDays = [
  'Domingo',
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
]

export default function CalendarSettingsForm({
  formData,
}: {
  formData?: CalendarConfigurationData
}) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<CalendarConfigurationData>({
    resolver: zodResolver(calendarConfigurationSchema),
    defaultValues: formData,
  })

  const { handleMessage } = useSnackbarContext()

  const onSubmit = async (data: CalendarConfigurationData) => {
    try {
      await setCalendarConfiguration({
        ...data,
      })
      handleMessage({
        type: 'success',
        title: 'configurações salvas com sucesso!',
      })
    } catch (error) {
      console.error(error)
      handleMessage({
        type: 'error',
        title: 'Erro ao salvar as configurações de horário',
      })
    }
  }

  const handleReplicate = (dayIndex: number) => {
    const sourceSchedules = getValues(
      `${getWeekDayKey(dayIndex)}.workSchedules`,
    )
    if (sourceSchedules) {
      weekDays.forEach((_, index) => {
        if (index !== dayIndex) {
          const isActive = getValues(`${getWeekDayKey(index)}.isActive`)
          if (isActive) {
            setValue(`${getWeekDayKey(index)}.workSchedules`, sourceSchedules)
          }
        }
      })
    }
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-2 p-4">
        <Input.Root>
          <Input.Label>Intervalo entre horários</Input.Label>
          <Input.Field
            endAdornment={<span className="-translate-x-full px-4">min</span>}
            error={!!errors?.workTimeIncrementInMinutes}
            type="number"
            slotProps={{
              input: {
                min: 1,
                className: 'max-w-[160px]',
              },
            }}
            {...register('workTimeIncrementInMinutes')}
          />
        </Input.Root>
        {weekDays.map((day, dayIndex) => {
          const { fields, append, remove } = useFieldArray({
            control,
            name: `${getWeekDayKey(dayIndex)}.workSchedules` as const,
          })
          const isActive = watch(`${getWeekDayKey(dayIndex)}.isActive`)

          return (
            <div
              key={dayIndex}
              className="rounded-lg border border-slate-200 p-4 transition-all duration-300 dark:border-slate-800"
            >
              <div className="flex items-center gap-3">
                <Controller
                  name={`${getWeekDayKey(dayIndex)}.isActive`}
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      color="blue"
                      id={`day-${dayIndex}`}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <label
                  htmlFor={`day-${dayIndex}`}
                  className="font-medium text-slate-800 dark:text-slate-200"
                >
                  {day}
                </label>
              </div>

              {isActive && (
                <div className="mt-4 space-y-4 pl-6">
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="flex w-full items-end gap-4 rounded-md border-slate-300 dark:border-slate-700"
                    >
                      <Input.Root className="flex-1">
                        <Input.Label>Abre às</Input.Label>
                        <Input.Field
                          error={
                            !!errors?.[getWeekDayKey(dayIndex)]
                              ?.workSchedules?.[index]?.start
                          }
                          type="time"
                          {...register(
                            `${getWeekDayKey(
                              dayIndex,
                            )}.workSchedules.${index}.start`,
                          )}
                        />
                      </Input.Root>
                      <Input.Root className="flex-1">
                        <Input.Label>Fecha às</Input.Label>
                        <Input.Field
                          type="time"
                          error={
                            !!errors?.[getWeekDayKey(dayIndex)]
                              ?.workSchedules?.[index]?.end
                          }
                          {...register(
                            `${getWeekDayKey(
                              dayIndex,
                            )}.workSchedules.${index}.end`,
                          )}
                        />
                      </Input.Root>
                      <Button
                        type="button"
                        variant="outline"
                        className="p-2.5"
                        onClick={() => remove(index)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}

                  <div className="flex flex-col gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      size="small"
                      onClick={() => append({ start: '', end: '' })}
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Adicionar Horário
                    </Button>
                    <button
                      className="text-sm text-blue-500 hover:text-blue-700"
                      type="button"
                      onClick={() => handleReplicate(dayIndex)}
                    >
                      Replicar para os outros dias
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </Form>
  )
}
