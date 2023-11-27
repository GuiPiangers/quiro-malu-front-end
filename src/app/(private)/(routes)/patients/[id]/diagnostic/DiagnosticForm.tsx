'use client'

import { Input } from '@/components/input'
import Form from '../../../../../../components/form/Form'
import { sectionStyles } from '../../../../../../components/form/Styles'
import { DiagnosticResponse } from '@/services/patient/PatientService'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { clientPatientService } from '@/services/patient/clientPatientService'
import useSnackbarContext from '@/hooks/useSnackbarContext copy'

const setDiagnosticSchema = z.object({
  diagnostic: z.string(),
  treatmentPlan: z.string(),
})

export type setDiagnosticData = z.infer<typeof setDiagnosticSchema>

type DiagnosticFormProps = { formData: DiagnosticResponse }

export default function DiagnosticForm({
  formData: { diagnostic, treatmentPlan, patientId },
}: DiagnosticFormProps) {
  const { handleMessage: handleOpen } = useSnackbarContext()

  const setDiagnosticForm = useForm<DiagnosticResponse>({
    resolver: zodResolver(setDiagnosticSchema),
  })

  const {
    handleSubmit,
    formState: { isSubmitting, errors, dirtyFields },
    register,
    reset,
  } = setDiagnosticForm

  const setDiagnostic = async (data: setDiagnosticData) => {
    const res = await clientPatientService.setDiagnostic({ patientId, ...data })
    if (res.error) {
      handleOpen({ title: 'Erro!', description: res.message, type: 'error' })
    } else {
      reset({ ...data })
      handleOpen({ title: 'Diagnóstico salvo com sucesso!', type: 'success' })
    }
  }

  return (
    <Form onSubmit={handleSubmit(setDiagnostic)}>
      <section aria-label="Diagnóstico do paciente" className={sectionStyles()}>
        <Input.Root>
          <Input.Label notSave={dirtyFields.diagnostic}>
            Diagnóstico
          </Input.Label>
          <Input.Field
            multiline
            minRows={4}
            disabled={isSubmitting}
            defaultValue={diagnostic}
            {...register('diagnostic')}
            notSave={dirtyFields.diagnostic}
          />
          {errors.diagnostic && (
            <Input.Message error>{errors.diagnostic.message}</Input.Message>
          )}
        </Input.Root>

        <Input.Root>
          <Input.Label notSave={dirtyFields.treatmentPlan}>
            Plano de tratamento
          </Input.Label>
          <Input.Field
            multiline
            minRows={4}
            disabled={isSubmitting}
            defaultValue={treatmentPlan}
            {...register('treatmentPlan')}
            notSave={dirtyFields.treatmentPlan}
          />
          {errors.treatmentPlan && (
            <Input.Message error>{errors.treatmentPlan.message}</Input.Message>
          )}
        </Input.Root>
      </section>
    </Form>
  )
}
