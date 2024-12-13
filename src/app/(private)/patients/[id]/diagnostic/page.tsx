import { ParamsType } from '../page'
import DiagnosticForm from './components/DiagnosticForm'
import { Validate } from '@/services/api/Validate'
import { getDiagnostic } from '@/services/patient/patient'

export default async function Diagnostic({ params }: { params: ParamsType }) {
  const id = params.id
  const patientData = await getDiagnostic(id).then((res) =>
    Validate.isOk(res) ? res : undefined,
  )

  return (
    <DiagnosticForm
      formData={{
        diagnostic: patientData?.diagnostic,
        treatmentPlan: patientData?.treatmentPlan,
        patientId: id,
      }}
    />
  )
}
