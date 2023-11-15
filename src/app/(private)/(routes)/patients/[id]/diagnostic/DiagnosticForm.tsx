'use client'

import { Input } from '@/components/formField'
import Form from '../../components/Form'
import { sectionStyles } from '../../components/Styles'
import { DiagnosticResponse } from '@/services/patient/PatientService'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { clientPatientService } from '@/services/patient/clientPatientService'

const setDiagnosticSchema = z.object({
  diagnostic: z.string(),
  treatmentPlan: z.string(),
})

export type setDiagnosticData = z.infer<typeof setDiagnosticSchema>

type DiagnosticFormProps = { formData: DiagnosticResponse }

export default function DiagnosticForm({
  formData: { diagnostic, treatmentPlan },
}: DiagnosticFormProps) {
  const createPatientForm = useForm<DiagnosticResponse>({
    resolver: zodResolver(setDiagnosticSchema),
  })

  const {
    handleSubmit,
    formState: { isSubmitting, errors },
    register,
  } = createPatientForm

  return (
    <Form onSubmit={handleSubmit(clientPatientService.setDiagnostic)}>
      <section aria-label="Diagnóstico do paciente" className={sectionStyles()}>
        <Input.Root>
          <Input.Label>Diagnóstico</Input.Label>
          <Input.Field
            multiline
            minRows={4}
            disabled={isSubmitting}
            defaultValue={diagnostic}
            {...register('diagnostic')}
          />
          {errors.diagnostic && (
            <Input.Message error>{errors.diagnostic.message}</Input.Message>
          )}
        </Input.Root>

        <Input.Root>
          <Input.Label>Plano de tratamento</Input.Label>
          <Input.Field
            multiline
            minRows={4}
            disabled={isSubmitting}
            defaultValue={treatmentPlan}
            {...register('treatmentPlan')}
          />
          {errors.treatmentPlan && (
            <Input.Message error>{errors.treatmentPlan.message}</Input.Message>
          )}
        </Input.Root>
      </section>
    </Form>
  )
}
