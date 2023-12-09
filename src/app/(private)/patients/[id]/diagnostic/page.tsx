import { ParamsType } from '../page'
import { patientService } from '@/services/patient/serverPatientService'
import DiagnosticForm from './components/DiagnosticForm'
import { Validate } from '@/services/api/Validate'

export default async function Diagnostic({ params }: { params: ParamsType }) {
  const id = params.id
  const patientData = await patientService
    .getDiagnostic(id)
    .then((res) => (Validate.isOk(res) ? res : undefined))

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
