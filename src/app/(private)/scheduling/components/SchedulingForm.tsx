'use client'

import { Input } from '@/components/input'
import Form, { FormProps } from '@/components/form/Form'
import { sectionStyles } from '@/components/form/Styles'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import useSnackbarContext from '@/hooks/useSnackbarContext'
import { SchedulingResponse } from '@/services/scheduling/actions/scheduling'
import { responseError } from '@/services/api/api'

import Duration from '@/app/(private)/components/Duration'
import { useCallback, useEffect, useState } from 'react'
import { ServiceResponse } from '@/services/service/actions/service'
import { Validate } from '@/services/api/Validate'
import {
  PatientResponse,
  PatientsListResponse,
} from '@/services/patient/PatientService'
import Phone from '@/utils/Phone'
import DateTime from '@/utils/Date'
import {
  createPatient,
  getPatient,
  listPatient,
} from '@/services/patient/actions/patient'
import ServiceSelect from '@/components/input/ServiceSelect'

const setSchedulingSchema = z.object({
  date: z.string().min(1, { message: 'Campo obrigatório' }),
  service: z.string({ required_error: 'Campo obrigatório' }),
  duration: z.coerce
    .number()
    .min(1, { message: 'A duração deve ser definida' }),
  status: z.enum(['Agendado', 'Atendido']).optional(),
  patientId: z.string().optional(),
  patientName: z.string({ required_error: 'Campo obrigatório' }),
  patientPhone: z.string({ required_error: 'Campo obrigatório' }),
})

export type setSchedulingData = z.infer<typeof setSchedulingSchema>

type SchedulingFormProps = {
  action(
    data: SchedulingResponse | (setSchedulingData & { id?: string }),
  ): Promise<SchedulingResponse | responseError>
  formData?: Partial<
    SchedulingResponse & { patient: string; patientPhone: string }
  >
  afterValidation?(): void
} & FormProps

export default function SchedulingForm({
  formData,
  afterValidation,
  action,
  ...formProps
}: SchedulingFormProps) {
  const {
    service,
    id,
    duration: durationService,
    date,
    patientId,
    patient,
    patientPhone,
    status,
  } = formData || {}
  const { handleMessage } = useSnackbarContext()

  const [selectedService, setSelectedService] = useState<ServiceResponse>()

  const [patients, setPatients] = useState<PatientsListResponse>()
  const [selectedPatient, setSelectedPatient] =
    useState<PatientResponse | null>(null)
  const [patientSearch, setPatientSearch] = useState('')
  const [patientPage, setPatientPage] = useState(1)
  const [phone, setPhone] = useState(patientPhone || '')
  const [duration, setDuration] = useState(durationService || 0)

  const setSchedulingForm = useForm<setSchedulingData>({
    resolver: zodResolver(setSchedulingSchema),
  })

  const {
    handleSubmit,
    formState: { isSubmitting, errors, dirtyFields },
    register,
    reset,
    setError,
    setValue,
  } = setSchedulingForm

  console.log(dirtyFields)

  const setScheduling = async (data: setSchedulingData) => {
    const patient = selectedPatient
      ? selectedPatient.id
      : await createPatient({ name: patientSearch, phone })
          .then((res) => (Validate.isOk(res) ? res.id : undefined))
          .catch((err) => console.log(err))

    if (patient) {
      const res = await action({
        ...data,
        id,
        duration: data.duration || duration,
        status,
        patientId: selectedPatient?.id || patient,
      })

      if (Validate.isError(res)) {
        if (res.type) {
          setError(res.type as keyof setSchedulingData, {
            message: res.message,
          })
        } else
          handleMessage({
            title: 'Erro!',
            description: res.message,
            type: 'error',
          })
      } else {
        reset({ ...data }, { keepValues: true })

        if (afterValidation) afterValidation()
        handleMessage({
          title: 'Serviço salvo com sucesso!',
          type: 'success',
        })
      }
    }
  }

  const setPatientPhone = (value: string) => {
    setPhone(value)
    setValue('patientPhone', value)
  }
  const setService = useCallback(
    (value: ServiceResponse) => {
      setSelectedService(value)
      setValue('service', value.name)
      setDuration(value.duration)
    },
    [setValue],
  )

  useEffect(() => {
    Promise.all([patientId && getPatient(patientId)]).then(([patientData]) => {
      if (patientData && Validate.isOk(patientData)) {
        setSelectedPatient(patientData)
        setValue('patientPhone', (patientData as PatientResponse).phone)
      }
    })
  }, [patientId, setValue])

  useEffect(() => {
    listPatient({ limit: 'all' }).then((data) => {
      Validate.isOk(data) && setPatients(data)
    })
    setPatientPage(1)
  }, [])
  return (
    <Form onSubmit={handleSubmit(setScheduling)} {...formProps}>
      <section aria-label="Diagnóstico do paciente" className={sectionStyles()}>
        <Input.Root>
          <Input.Label required notSave={dirtyFields.date}>
            Data
          </Input.Label>
          <Input.Field
            type="datetime-local"
            autoComplete="off"
            defaultValue={date ? DateTime.getIsoDateTime(date) : ''}
            disabled={isSubmitting}
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
            notSave={dirtyFields.service}
            defaultValue={service}
            onInitialize={(value) => {
              value && setService(value)
            }}
            value={selectedService}
            onChange={(_, value) => {
              value && setService(value as ServiceResponse)
            }}
          />
          {errors.service && (
            <Input.Message error>{errors.service.message}</Input.Message>
          )}
        </Input.Root>
        <Duration
          duration={duration}
          setValue={(value: number) => {
            setValue('duration', value, {
              shouldDirty: true,
              shouldValidate: true,
            })
            setDuration(value)
          }}
          notSave={dirtyFields.duration}
          errors={errors?.duration?.message}
        />

        <Input.Root>
          <Input.Label required notSave={dirtyFields.patientName}>
            Paciente
          </Input.Label>
          <Input.Autocomplete
            freeSolo
            disabled={isSubmitting}
            error={!!errors.patientName}
            condition={
              patients &&
              Math.ceil(patients.total / patients?.limit) <= patientPage
            }
            onInputChange={(e, value) => {
              setPatientSearch(value)
              setValue('patientName', value)
            }}
            onChange={(e, value) => {
              setPatientPhone(
                value ? (value as unknown as PatientResponse).phone : '',
              )
              setSelectedPatient(value as unknown as PatientResponse)
            }}
            defaultValue={{
              label: patient || '',
              id: patientId || '',
            }}
            options={
              patients
                ? patients?.patients.map((patient) => ({
                    id: patient.id!,
                    label: patient.name,
                    ...patient,
                  }))
                : [{ label: 'nada', id: 'nada' }]
            }
          />
          {errors.patientName && (
            <Input.Message error>{errors.patientName.message}</Input.Message>
          )}
        </Input.Root>

        <Input.Root>
          <Input.Label required>Telefone</Input.Label>
          <Input.Field
            autoComplete="off"
            error={!!errors.patientPhone}
            disabled={!!selectedPatient}
            onChange={(e) => setPatientPhone(Phone.format(e.target.value))}
            value={phone}
            inputMode="numeric"
          />
          {errors.patientPhone && (
            <Input.Message error>{errors.patientPhone.message}</Input.Message>
          )}
        </Input.Root>
      </section>
    </Form>
  )
}
