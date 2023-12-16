import { SchedulingParamsType } from '../patientData/page'
import { patientService } from '@/services/patient/serverPatientService'
import { Validate } from '@/services/api/Validate'
import SchedulingDiagnosticForm from './components/SchedulingDiagnosticForm'

export default async function Diagnostic({
  params,
}: {
  params: SchedulingParamsType
}) {
  const patientId = params.patientId
  const patientData = await patientService
    .getDiagnostic(patientId)
    .then((res) => (Validate.isOk(res) ? res : undefined))

  return (
    <SchedulingDiagnosticForm
      formData={{
        diagnostic: patientData?.diagnostic,
        treatmentPlan: patientData?.treatmentPlan,
        patientId,
      }}
    />
  )
}
