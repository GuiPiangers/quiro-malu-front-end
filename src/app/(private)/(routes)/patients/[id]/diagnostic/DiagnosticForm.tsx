'use client'

import { Input } from '@/components/formField'
import Form from '../../components/Form'
import { sectionStyles } from '../../components/Styles'
import { DiagnosticResponse } from '@/services/patient/PatientService'

type DiagnosticFormProps = { formData: DiagnosticResponse }

export default function DiagnosticForm({
  formData: { diagnostic, treatmentPlan },
}: DiagnosticFormProps) {
  return (
    <Form>
      <section aria-label="Diagnóstico do paciente" className={sectionStyles()}>
        <Input.Root>
          <Input.Label>Diagnóstico</Input.Label>
          <Input.Field multiline minRows={4} defaultValue={diagnostic} />
        </Input.Root>

        <Input.Root>
          <Input.Label>Plano de tratamento</Input.Label>
          <Input.Field multiline minRows={4} defaultValue={treatmentPlan} />
        </Input.Root>
      </section>
    </Form>
  )
}
