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

import Duration, { DurationRef } from '@/app/(private)/components/Duration'
import { useCallback, useEffect, useRef, useState } from 'react'
import { clientService } from '@/services/service/clientService'
import { ServiceResponse } from '@/services/service/Service'
import { Validate } from '@/services/api/Validate'
import { clientPatientService } from '@/services/patient/clientPatientService'
import {
  PatientResponse,
  PatientsListResponse,
} from '@/services/patient/PatientService'
import Phone from '@/utils/Phone'

const setSchedulingSchema = z.object({
  date: z.string().min(1, 'Campo obrigatório'),
  service: z.string(),
  duration: z.coerce.number().optional(),
  status: z.string().optional(),
  patientId: z.string().optional(),
})

export type setSchedulingData = z.infer<typeof setSchedulingSchema>

type SchedulingFormProps = {
  action(
    data: SchedulingResponse | setSchedulingData,
  ): Promise<SchedulingResponse | responseError>
  formData?: Partial<SchedulingResponse>
  afterValidation?(): void
} & FormProps

export default function SchedulingForm({
  formData,
  afterValidation,
  action,
  ...formProps
}: SchedulingFormProps) {
  const { service, id, duration, date, patientId, status } = formData || {}
  const { handleMessage } = useSnackbarContext()

  const [services, setServices] = useState<ServiceResponse[]>()
  const [selectedService, setSelectedService] = useState<ServiceResponse>()

  const [patients, setPatients] = useState<PatientsListResponse>()
  const [selectedPatient, setSelectedPatient] =
    useState<PatientResponse | null>(null)
  const [patientSearch, setPatientSearch] = useState('')
  const [patientPage, setPatientPage] = useState(1)
  const [phone, setPhone] = useState('')

  useEffect(() => {
    clientService
      .list({ page: '1' })
      .then((data) => Validate.isOk(data) && setServices(data.services))
    Promise.all([
      clientService.list({ page: '1' }),
      patientId && clientPatientService.get(patientId),
    ]).then(([serviceData, patientData]) => {
      Validate.isOk(serviceData) && setServices(serviceData.services)
      patientData &&
        Validate.isOk(patientData) &&
        setSelectedPatient(patientData)
    })
  }, [patientId])

  useEffect(() => {
    clientPatientService
      .list({
        search: { name: patientSearch },
      })
      .then((data) => {
        Validate.isOk(data) && setPatients(data)
      })
  }, [patientSearch])

  const setSchedulingForm = useForm<setSchedulingData>({
    resolver: zodResolver(setSchedulingSchema),
  })

  const loadMorePatients = () => {
    setPatientPage((value) => value + 1)

    clientPatientService
      .list({
        page: `${patientPage + 1}`,
        search: { name: patientSearch },
      })
      .then((data) => {
        if (
          Validate.isOk(data) &&
          patients &&
          !(Math.ceil(patients.total / patients?.limit) === patientPage)
        ) {
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
    <Form onSubmit={handleSubmit(setScheduling)} {...formProps}>
      <section aria-label="Diagnóstico do paciente" className={sectionStyles()}>
        <Input.Root>
          <Input.Label required notSave={dirtyFields.date}>
            Data
          </Input.Label>
          <Input.Field
            type="datetime-local"
            autoComplete="off"
            disabled={isSubmitting}
            defaultValue={date}
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
            onChange={(e, newValue) => {
              setSelectedService(newValue as ServiceResponse)
              setValue('service', (newValue as ServiceResponse).name)
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
          duration={selectedService?.duration}
          setValue={(value: number) => {
            setValue('duration', value)
          }}
          errors={errors?.duration?.message}
        />

        <Input.Root>
          <Input.Label required notSave={dirtyFields.patientId}>
            Paciente
          </Input.Label>
          <Input.Autocomplete
            freeSolo
            disabled={isSubmitting}
            error={!!errors.patientId}
            onInputChange={(e, value) => setPatientSearch(value)}
            onChange={(e, value) => {
              setPhone(value ? (value as unknown as PatientResponse).phone : '')
              setSelectedPatient(value as unknown as PatientResponse)
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
          {errors.patientId && (
            <Input.Message error>{errors.patientId.message}</Input.Message>
          )}
        </Input.Root>

        <Input.Root>
          <Input.Label required>Telefone</Input.Label>
          <Input.Field
            autoComplete="off"
            disabled={!!selectedPatient}
            onChange={(e) => setPhone(Phone.format(e.target.value))}
            value={phone}
          />
        </Input.Root>
      </section>
    </Form>
  )
}
