'use client'

import { Input } from '@/components/input'
import Form, { FormProps } from '@/components/form/Form'
import { sectionStyles } from '@/components/form/Styles'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import useSnackbarContext from '@/hooks/useSnackbarContext'
import { SchedulingResponse } from '@/services/scheduling/scheduling'
import { responseError } from '@/services/api/api'

import Duration from '@/app/(private)/components/Duration'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Validate } from '@/services/api/Validate'
import {
  PatientResponse,
  createPatient,
  getPatient,
  listPatient,
} from '@/services/patient/patient'
import Phone from '@/utils/Phone'
import DateTime from '@/utils/Date'

import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'
import { ClinicianServiceItem } from '@/services/clinicUsers/clinicUsers'
import ClinicianSelectField from './ClinicianSelectField'
import { useEventClinicians } from '@/hooks/useEventClinicians'
import { usePermissionScope } from '@/hooks/useAccess'
import { isOwnEventsScope } from '@/lib/eventsClinicians'
import { useOptionalSession } from '@/contexts/SessionContext'

const setSchedulingSchema = z.object({
  userId: z.string().min(1, { message: 'Selecione o profissional' }),
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
    SchedulingResponse & {
      patient: string
      patientPhone: string
      userId?: string
    }
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
  const searchParams = useSearchParams()
  const defaultUserId = formData?.userId ?? searchParams.get('userId') ?? ''

  const [selectedService, setSelectedService] = useState<ClinicianServiceItem>()

  const [selectedPatient, setSelectedPatient] =
    useState<PatientResponse | null>(null)
  const [patientSearch, setPatientSearch] = useState('')
  const [phone, setPhone] = useState(patientPhone || '')
  const [duration, setDuration] = useState(durationService || 0)

  const setSchedulingForm = useForm<setSchedulingData>({
    resolver: zodResolver(setSchedulingSchema),
    defaultValues: {
      userId: defaultUserId,
      service: service ?? '',
      duration: durationService ?? 0,
    },
  })

  const {
    handleSubmit,
    formState: { isSubmitting, errors, dirtyFields },
    register,
    reset,
    setError,
    setValue,
  } = setSchedulingForm

  const { data: patients } = useQuery({
    queryKey: ['patients'],
    queryFn: async () =>
      await listPatient({ limit: 'all' }).then((res) =>
        Validate.isOk(res) ? res : undefined,
      ),
  })

  const session = useOptionalSession()
  const eventsScope = usePermissionScope('events:read')
  const lockClinician = isOwnEventsScope(eventsScope)

  const { data: clinicians } = useEventClinicians()

  const userId = setSchedulingForm.watch('userId')
  const isEditing = !!id

  const clinicianServices = useMemo(
    () =>
      clinicians?.find((clinician) => clinician.id === userId)?.services ?? [],
    [clinicians, userId],
  )

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
        userId: data.userId,
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
    (value: ClinicianServiceItem) => {
      setSelectedService(value)
      setValue('service', value.name, {
        shouldDirty: true,
        shouldValidate: true,
      })
      setValue('duration', value.duration, {
        shouldDirty: true,
        shouldValidate: true,
      })
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
    if (isEditing || !clinicians?.length || userId) return
    const defaultId =
      clinicians.find((c) => c.id === session?.userId)?.id ?? clinicians[0].id
    setValue('userId', defaultId, { shouldValidate: true })
  }, [clinicians, isEditing, session?.userId, setValue, userId])

  useEffect(() => {
    if (!service || !clinicianServices.length) return
    const match = clinicianServices.find((item) => item.name === service)
    if (match) setService(match)
  }, [service, clinicianServices, setService])

  useEffect(() => {
    if (!selectedService) return
    const stillAvailable = clinicianServices.some(
      (item) => item.id === selectedService.id,
    )
    if (!stillAvailable) {
      setSelectedService(undefined)
      setValue('service', '', { shouldValidate: true })
      setValue('duration', 0, { shouldValidate: true })
      setDuration(0)
    }
  }, [clinicianServices, selectedService, setValue])

  const serviceSelectPlaceholder = !userId
    ? 'Selecione o profissional primeiro'
    : clinicianServices.length === 0
    ? 'Nenhum serviço vinculado a este profissional'
    : 'Selecione o serviço'

  return (
    <Form
      onSubmit={handleSubmit(setScheduling)}
      {...formProps}
      className="border-none"
    >
      <section aria-label="Dados do agendamento" className={sectionStyles()}>
        <Input.Root>
          <Input.Label required notSave={dirtyFields.userId}>
            Profissional
          </Input.Label>
          <ClinicianSelectField
            clinicians={clinicians ?? []}
            value={userId}
            readOnly={lockClinician && (clinicians?.length ?? 0) <= 1}
            disabled={isSubmitting}
            error={!!errors.userId}
            onChange={(value) => {
              setValue('userId', value, {
                shouldDirty: true,
                shouldValidate: true,
              })
              setSelectedService(undefined)
              setValue('service', '', { shouldValidate: true })
              setValue('duration', 0, { shouldValidate: true })
              setDuration(0)
            }}
          />
          {errors.userId && (
            <Input.Message error>{errors.userId.message}</Input.Message>
          )}
        </Input.Root>

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
            value={selectedService?.id ?? ''}
            disabled={isSubmitting || !userId || clinicianServices.length === 0}
            error={!!errors.service}
            notSave={dirtyFields.service}
            slotProps={{ popper: { className: 'z-40' } }}
            onChange={(_, selected) => {
              const clinicianService = clinicianServices.find(
                (item) => item.id === selected,
              )
              if (clinicianService) setService(clinicianService)
            }}
            renderValue={() =>
              selectedService?.name ?? (
                <span className="text-slate-500">
                  {serviceSelectPlaceholder}
                </span>
              )
            }
          >
            {clinicianServices.map((clinicianService) => (
              <Input.Option
                key={clinicianService.id}
                value={clinicianService.id}
              >
                {clinicianService.name}
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
