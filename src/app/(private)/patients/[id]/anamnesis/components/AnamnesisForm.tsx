'use client'

import { Input } from '@/components/input'
import RadioButton from '@/components/radioButton/RadioButton'
import Form from '../../../../../../components/form/Form'
import { sectionStyles } from '../../../../../../components/form/Styles'
import { AnamnesisResponse } from '@/services/patient/PatientService'
import { ReactNode, useEffect, useState } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useWatch } from 'react-hook-form'
import { clientPatientService } from '@/services/patient/clientPatientService'
import useSnackbarContext from '@/hooks/useSnackbarContext copy'
import { Validate } from '@/services/api/Validate'
import { useRouter } from 'next/navigation'

const setAnamnesisSchema = z.object({
  activities: z.string().optional(),
  currentIllness: z.string().optional(),
  familiarHistory: z.string().optional(),
  history: z.string().optional(),
  mainProblem: z.string().optional(),
  medicines: z.string().optional(),
  smoke: z.string().optional().nullable(),
  surgeries: z.string().optional(),
  underwentSurgery: z.boolean().optional().nullable(),
  // .transform((value) => {
  //   return value === 'yes' ? true : value === 'no' ? false : null
  // }),
  useMedicine: z.boolean().optional().nullable(),
  // .transform((value) => {
  //   return value === 'yes' ? true : value === 'no' ? false : null
  // }),
})

export type setAnamnesisData = z.infer<typeof setAnamnesisSchema>

export type AnamnesisFormProps = {
  formData: AnamnesisResponse
  afterValidate?(): void
  buttons?: ReactNode
  btWrapperClassName?: string
}

export default function AnamnesisForm({
  formData: {
    patientId,
    activities,
    currentIllness,
    familiarHistory,
    history,
    mainProblem,
    medicines,
    smoke,
    surgeries,
    underwentSurgery,
    useMedicine,
  },
  buttons,
  btWrapperClassName,
  afterValidate,
}: AnamnesisFormProps) {
  const { handleMessage } = useSnackbarContext()

  const setAnamnesisForm = useForm<setAnamnesisData>({
    resolver: zodResolver(setAnamnesisSchema),
    values: {
      underwentSurgery:
        underwentSurgery === undefined ? null : underwentSurgery,
      useMedicine: useMedicine === undefined ? null : useMedicine,
      activities,
      currentIllness,
      familiarHistory,
      history,
      mainProblem,
      medicines: medicines ?? '',
      smoke,
      surgeries: surgeries ?? '',
    },
  })

  const {
    handleSubmit,
    formState: { isSubmitting, dirtyFields, errors },
    register,
    reset,
    watch,
    setValue,
  } = setAnamnesisForm

  const smokeState = watch('smoke')
  const underwentSurgeryState = watch('underwentSurgery')
  const useMedicineState = watch('useMedicine')
  // const [underwentSurgeryState, setUnderwentSurgeryState] =
  //   useState(underwentSurgery)
  // const [useMedicineState, setUseMedicineState] = useState(useMedicine)

  const router = useRouter()

  const setAnamnesis = async (data: setAnamnesisData) => {
    const res = await clientPatientService.setAnamnesis({ patientId, ...data })
    if (Validate.isError(res)) {
      handleMessage({ title: 'Erro!', description: res.message, type: 'error' })
    } else {
      if (afterValidate) {
        afterValidate()
      } else {
        reset(data, { keepValues: true })
        router.refresh()
        handleMessage({ title: 'Anamnese salva com sucesso!', type: 'success' })
      }
    }
  }

  return (
    <Form
      onSubmit={handleSubmit(setAnamnesis)}
      buttons={buttons}
      btWrapperClassName={btWrapperClassName}
    >
      <section aria-label="Anamnese do paciente" className={sectionStyles()}>
        <Input.Root>
          <Input.Label notSave={dirtyFields.mainProblem}>
            Queixa principal
          </Input.Label>
          <Input.Field
            multiline
            minRows={4}
            disabled={isSubmitting}
            defaultValue={mainProblem}
            {...register('mainProblem')}
            notSave={dirtyFields.mainProblem}
          />
          {errors.mainProblem && (
            <Input.Message error>{errors.mainProblem.message}</Input.Message>
          )}
        </Input.Root>

        <Input.Root>
          <Input.Label notSave={dirtyFields.currentIllness}>
            História e moléstia atual
          </Input.Label>
          <Input.Field
            multiline
            minRows={4}
            disabled={isSubmitting}
            defaultValue={currentIllness}
            {...register('currentIllness')}
            notSave={dirtyFields.currentIllness}
          />
          {errors.currentIllness && (
            <Input.Message error>{errors.currentIllness.message}</Input.Message>
          )}
        </Input.Root>

        <Input.Root>
          <Input.Label notSave={dirtyFields.history}>
            Histórico e antecedentes
          </Input.Label>
          <Input.Field
            multiline
            minRows={4}
            disabled={isSubmitting}
            defaultValue={history}
            {...register('history')}
            notSave={dirtyFields.history}
          />
          {errors.history && (
            <Input.Message error>{errors.history.message}</Input.Message>
          )}
        </Input.Root>

        <Input.Root>
          <Input.Label notSave={dirtyFields.familiarHistory}>
            Histórico familiar
          </Input.Label>
          <Input.Field
            multiline
            minRows={4}
            disabled={isSubmitting}
            defaultValue={familiarHistory}
            {...register('familiarHistory')}
            notSave={dirtyFields.familiarHistory}
          />
          {errors.familiarHistory && (
            <Input.Message error>
              {errors.familiarHistory.message}
            </Input.Message>
          )}
        </Input.Root>

        <Input.Root>
          <Input.Label notSave={dirtyFields.activities}>
            Atividades que realiza
          </Input.Label>
          <Input.Field
            multiline
            minRows={4}
            disabled={isSubmitting}
            defaultValue={activities}
            {...register('activities')}
            notSave={dirtyFields.activities}
          />
          {errors.activities && (
            <Input.Message error>{errors.activities.message}</Input.Message>
          )}
        </Input.Root>

        <div className="flex w-fit flex-col gap-y-1">
          <p className="col-span-full text-sm font-medium">Fumante?</p>
          <div className="flex gap-4">
            <RadioButton
              label="Sim"
              value={'yes'}
              disabled={isSubmitting}
              defaultChecked={smokeState === 'yes'}
              checked={smokeState === 'yes'}
              {...register('smoke')}
            />
            <RadioButton
              label="Não"
              value={'no'}
              disabled={isSubmitting}
              defaultChecked={smokeState === 'no'}
              checked={smokeState === 'no'}
              {...register('smoke')}
            />
            <RadioButton
              label="Passivo"
              value={'passive'}
              {...register('smoke')}
              checked={smokeState === 'passive'}
              disabled={isSubmitting}
              defaultChecked={smokeState === 'passive'}
              // onClick={() => setSmokeState('passive')}
            />
          </div>
          {errors.smoke && (
            <Input.Message error>{errors.smoke.message}</Input.Message>
          )}
        </div>

        <div className="flex w-fit flex-col gap-y-1">
          <p className="col-span-full text-sm font-medium">Usa medicamentos?</p>
          <div className="flex gap-4">
            <RadioButton
              label="Sim"
              value={'yes'}
              disabled={isSubmitting}
              onChange={() => {
                setValue('useMedicine', true)
              }}
              defaultChecked={useMedicine === true}
              checked={useMedicineState === true}
              // onClick={() => setUseMedicineState(true)}
            />
            <RadioButton
              label="Não"
              value={'no'}
              disabled={isSubmitting}
              onChange={() => {
                setValue('useMedicine', false)
              }}
              checked={useMedicineState === false}
              defaultChecked={!useMedicine}
            />
          </div>
          {errors.useMedicine && (
            <Input.Message error>{errors.useMedicine.message}</Input.Message>
          )}
        </div>

        <Input.Root>
          <Input.Label notSave={dirtyFields.medicines}>
            Se sim quais?
          </Input.Label>
          <Input.Field
            multiline
            minRows={4}
            defaultValue={medicines}
            disabled={!useMedicineState || isSubmitting}
            {...register('medicines')}
            notSave={dirtyFields.medicines}
          />
          {errors.medicines && (
            <Input.Message error>{errors.medicines.message}</Input.Message>
          )}
        </Input.Root>

        <div className="flex w-fit flex-col gap-y-1">
          <p className="col-span-full text-sm font-medium">
            Passou por alguma cirurgia?
          </p>
          <div className="flex gap-4">
            <RadioButton
              label="Sim"
              value={'yes'}
              disabled={isSubmitting}
              onChange={() => {
                setValue('underwentSurgery', true)
              }}
              checked={underwentSurgeryState === true}
              defaultChecked={underwentSurgery === true}
              // onClick={() => setUnderwentSurgeryState(true)}
            />
            <RadioButton
              label="Não"
              value={'no'}
              disabled={isSubmitting}
              onChange={() => {
                setValue('underwentSurgery', false)
              }}
              checked={underwentSurgeryState === false}
              defaultChecked={!underwentSurgery}
              // onClick={() => setUnderwentSurgeryState(false)}
            />
          </div>
          {errors.underwentSurgery && (
            <Input.Message error className="col-span-full">
              {errors.underwentSurgery.message}
            </Input.Message>
          )}
        </div>

        <Input.Root>
          <Input.Label notSave={dirtyFields.surgeries}>
            Se sim quais?
          </Input.Label>
          <Input.Field
            multiline
            minRows={4}
            defaultValue={surgeries}
            disabled={!underwentSurgeryState || isSubmitting}
            {...register('surgeries')}
            notSave={dirtyFields.surgeries}
          />
          {errors.surgeries && (
            <Input.Message error>{errors.surgeries.message}</Input.Message>
          )}
        </Input.Root>
      </section>
    </Form>
  )
}
