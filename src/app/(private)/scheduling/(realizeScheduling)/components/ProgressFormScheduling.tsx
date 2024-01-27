'use client'

import { Input } from '@/components/input'
import Form, {FormProps} from '@/components/form/Form'
import { sectionStyles } from '@/components/form/Styles' 
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import useSnackbarContext from '@/hooks/useSnackbarContext copy'
import { ProgressResponse } from '@/services/patient/PatientService'
import DateTime from '@/utils/Date'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { clientService } from '@/services/service/clientService'
import { ServiceResponse } from '@/services/service/Service'
import { Validate } from '@/services/api/Validate'
import Button from '@/components/Button'
import { setProgressSchema } from '@/app/(private)/patients/[id]/progress/components/ProgressForm'


export type setProgressData = z.infer<typeof setProgressSchema>

type ProgressFormProps = {
  formData: Partial<ProgressResponse>
  afterValidation?(): void
  handleFormState: Dispatch<SetStateAction<{
    progress: {};
    payment: {};
}>>
} & FormProps

export default function ProgressForm({
  formData,
  handleFormState,
  afterValidation,
  ...formProps
}: ProgressFormProps) {
  const { patientId, actualProblem, date, procedures, service, id } = formData
  const [services, setServices] = useState<ServiceResponse[]>()



  const { handleMessage } = useSnackbarContext()
  const setProgressForm = useForm<ProgressResponse>({
    resolver: zodResolver(setProgressSchema),
  })

  const {
    handleSubmit,
    formState: { isSubmitting, errors, dirtyFields },
    register,
    reset,
    setValue,
  } = setProgressForm

  const setProgress = async (data: setProgressData) => {
      reset({ ...data })
      handleFormState(value => ({...value, progress: data, }))
      if (afterValidation) afterValidation()
 
  }
  useEffect(() => {
    clientService
      .list({})
      .then((res) => Validate.isOk(res) && setServices(res.services))
    
    setValue('service', formData.service || '')
  }, [])

  return (
    <Form 
      {...formProps} 
      onSubmit={handleSubmit(setProgress)} 
      className='shadow-none' 
      btWrapperClassName='flex-row-reverse justify-between'
      buttons={
        <>
          <Button color='green'>Avançar</Button>
        </>
      }
    >
      <section aria-label="Diagnóstico do paciente" className={sectionStyles({class: 'overflow-auto '})}>
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
            {...register('service')}
            disabled={isSubmitting}
            defaultValue={service}
            error={!!errors.service}
            slotProps={{ popper: { className: 'z-40' } }}
            onChange={(_, newValue) => setValue('service', newValue as string)}
          >
            {services?.map((service) => (
              <Input.Option key={service.id} value={service.name}>
                {service.name}
              </Input.Option>
            ))}
          </Input.Select>

          {errors.service && (
            <Input.Message error>{errors.service.message}</Input.Message>
          )}
        </Input.Root>

        <Input.Root>
          <Input.Label notSave={dirtyFields.actualProblem}>
            Problema atual
          </Input.Label>
          <Input.Field
            autoComplete="off"
            multiline
            minRows={4}
            disabled={isSubmitting}
            defaultValue={actualProblem}
            error={!!errors.actualProblem}
            {...register('actualProblem')}
            notSave={dirtyFields.actualProblem}
          />
          {errors.actualProblem && (
            <Input.Message error>{errors.actualProblem.message}</Input.Message>
          )}
        </Input.Root>

        <Input.Root>
          <Input.Label notSave={dirtyFields.procedures}>
            Procedimentos
          </Input.Label>
          <Input.Field
            autoComplete="off"
            multiline
            minRows={4}
            disabled={isSubmitting}
            defaultValue={procedures}
            error={!!errors.procedures}
            {...register('procedures')}
            notSave={dirtyFields.procedures}
          />
          {errors.procedures && (
            <Input.Message error>{errors.procedures.message}</Input.Message>
          )}
        </Input.Root>

      </section>
    </Form>
  )
}
