'use client'

import { Input } from '@/components/input'
import Form, { FormProps } from '@/components/form/Form'
import { sectionStyles } from '@/components/form/Styles'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import useSnackbarContext from '@/hooks/useSnackbarContext copy'
import { SchedulingResponse } from '@/services/scheduling/SchedulingService'
import { responseError } from '@/services/api/api'

import Duration from '@/app/(private)/components/Duration'
import { useCallback, useEffect, useState } from 'react'
import { clientService } from '@/services/service/clientService'
import { ServiceResponse } from '@/services/service/Service'
import { Validate } from '@/services/api/Validate'
import { clientPatientService } from '@/services/patient/clientPatientService'
import {
  PatientResponse,
  PatientsListResponse,
} from '@/services/patient/PatientService'
import Phone from '@/utils/Phone'
import DateTime from '@/utils/Date'

const setSchedulingSchema = z.object({
  date: z.string().min(1, { message: 'Campo obrigatório' }),
  service: z.string({ required_error: 'Campo obrigatório' }),
  duration: z.coerce.number().optional(),
  status: z.string().optional(),
  patientId: z.string().optional(),
  patientName: z.string({ required_error: 'Campo obrigatório' }),
  patientPhone: z.string({ required_error: 'Campo obrigatório' }),
})

export type setSchedulingData = z.infer<typeof setSchedulingSchema>

type SchedulingFormProps = {
  action(
    data: SchedulingResponse | setSchedulingData,
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

  const [services, setServices] = useState<ServiceResponse[]>()
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

  const loadMorePatients = () => {
    if (patients && Math.ceil(patients.total / patients?.limit) === patientPage)
      return undefined
    clientPatientService
      .list({
        page: `${patientPage + 1}`,
        search: { name: patientSearch },
      })
      .then((data) => {
        if (Validate.isOk(data)) {
          setPatientPage((value) => value + 1)

          setPatients((value) => {
            if (value && value.patients) {
              return {
                total: data.total,
                limit: data.limit,
                patients: [...data.patients, ...value.patients],
              }
            }
          })
        }
      })
  }

  const {
    handleSubmit,
    formState: { isSubmitting, errors, dirtyFields },
    register,
    reset,
    setError,
    setValue,
  } = setSchedulingForm

  const setScheduling = async (data: setSchedulingData) => {
    const patient = selectedPatient
      ? selectedPatient?.id
      : await clientPatientService
          .create({ name: patientSearch, phone })
          .then((res) => (Validate.isOk(res) ? res.id : undefined))

    const res = await action({
      id,
      patientId: patient,
      duration: data.duration || duration,
      status,
      ...data,
    })

    if (Validate.isError(res)) {
      if (res.type) {
        setError(res.type as keyof setSchedulingData, { message: res.message })
      } else
        handleMessage({
          title: 'Erro!',
          description: res.message,
          type: 'error',
        })
    } else {
      reset({ ...data })
      if (afterValidation) afterValidation()
      handleMessage({
        title: 'Serviço salvo com sucesso!',
        type: 'success',
      })
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
    },
    [setValue],
  )

  useEffect(() => {
    clientService
      .list({ page: '1' })
      .then((data) => Validate.isOk(data) && setServices(data.services))
    Promise.all([
      clientService.list({ page: '1' }),
      patientId && clientPatientService.get(patientId),
    ]).then(([serviceData, patientData]) => {
      if (Validate.isOk(serviceData)) {
        setServices(serviceData.services)
        const selectedService = serviceData.services.find(
          (serviceData) => serviceData.name === service,
        )
        selectedService && setService(selectedService)
      }
      if (patientData && Validate.isOk(patientData)) {
        setSelectedPatient(patientData)
        setValue('patientPhone', (patientData as PatientResponse).phone)
      }
    })
  }, [patientId, service, setService, setValue])

  useEffect(() => {
    clientPatientService
      .list({
        search: { name: patientSearch },
      })
      .then((data) => {
        Validate.isOk(data) && setPatients(data)
      })
    setPatientPage(1)
  }, [patientSearch])

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
          <Input.Select
            value={selectedService}
            onChange={(e, newValue) => {
              if (!newValue) return
              setService(newValue as ServiceResponse)
              setDuration((newValue as ServiceResponse).duration)
            }}
            slotProps={{
              popper: { className: 'z-40' },
            }}
            disabled={isSubmitting}
            defaultValue={service}
            error={!!errors.service}
          >
            {services &&
              services.map((service) => (
                <Input.Option key={service.id} value={service}>
                  {service.name}
                </Input.Option>
              ))}
          </Input.Select>
          {errors.service && (
            <Input.Message error>{errors.service.message}</Input.Message>
          )}
        </Input.Root>

        <Duration
          duration={duration}
          setValue={(value: number) => {
            setDuration(value)
            setValue('duration', value)
          }}
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
            onLastOptionView={loadMorePatients}
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
