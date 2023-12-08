'use client'

import { Input } from '@/components/input'
import RadioButton from '@/components/radioButton/RadioButton'
import Form from '../../../../../../components/form/Form'
import { sectionStyles } from '../../../../../../components/form/Styles'
import { AnamnesisResponse } from '@/services/patient/PatientService'
import { useState } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { clientPatientService } from '@/services/patient/clientPatientService'
import useSnackbarContext from '@/hooks/useSnackbarContext copy'

const setAnamnesisSchema = z.object({
  activities: z.string().optional(),
  currentIllness: z.string().optional(),
  familiarHistory: z.string().optional(),
  history: z.string().optional(),
  mainProblem: z.string().optional(),
  medicines: z.string().optional(),
  smoke: z.string().optional().nullable(),
  surgeries: z.string().optional(),
  underwentSurgery: z.string().optional().nullable(),
  useMedicine: z.string().optional().nullable(),
})

export type setAnamnesisData = z.infer<typeof setAnamnesisSchema>

type AnamnesisFormProps = { formData: AnamnesisResponse }

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
}: AnamnesisFormProps) {
  const { handleMessage: handleOpen } = useSnackbarContext()

  const setAnamnesisForm = useForm<AnamnesisResponse>({
    resolver: zodResolver(setAnamnesisSchema),
  })

  const {
    handleSubmit,
    formState: { isSubmitting, dirtyFields, errors },
    register,
    reset,
  } = setAnamnesisForm
  const setAnamnesis = async (data: setAnamnesisData) => {
    const res = await clientPatientService.setAnamnesis({ patientId, ...data })
    if (res.error) {
      handleOpen({ title: 'Erro!', description: res.message, type: 'error' })
    } else {
      reset({ ...data })
      handleOpen({ title: 'Anamnese salva com sucesso!', type: 'success' })
    }
  }

  const [underwentSurgeryState, setUnderwentSurgeryState] = useState(
    underwentSurgery === 'yes',
  )
  const [useMedicineState, setUseMedicineState] = useState(
    useMedicine === 'yes',
  )

  return (
    <Form onSubmit={handleSubmit(setAnamnesis)}>
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
              defaultChecked={smoke === 'yes'}
              {...register('smoke')}
            />
            <RadioButton
              label="Não"
              value={'no'}
              disabled={isSubmitting}
              defaultChecked={smoke === 'no'}
              {...register('smoke')}
            />
            <RadioButton
              label="Passivo"
              value={'passive'}
              {...register('smoke')}
              disabled={isSubmitting}
              defaultChecked={smoke === 'passive'}
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
              {...register('useMedicine')}
              defaultChecked={useMedicine === 'yes'}
              onClick={() => setUseMedicineState(true)}
            />
            <RadioButton
              label="Não"
              value={'no'}
              disabled={isSubmitting}
              {...register('useMedicine')}
              defaultChecked={useMedicine === 'no'}
              onClick={() => setUseMedicineState(false)}
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
              {...register('underwentSurgery')}
              defaultChecked={underwentSurgery === 'yes'}
              onClick={() => setUnderwentSurgeryState(true)}
            />
            <RadioButton
              label="Não"
              value={'no'}
              disabled={isSubmitting}
              {...register('underwentSurgery')}
              defaultChecked={underwentSurgery === 'no'}
              onClick={() => setUnderwentSurgeryState(false)}
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
