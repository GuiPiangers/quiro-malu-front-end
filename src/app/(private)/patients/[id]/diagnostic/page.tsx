import { ParamsType } from '../page'
import DiagnosticForm from './components/DiagnosticForm'
import { Validate } from '@/services/api/Validate'
import { getDiagnostic } from '@/services/patient/patient'
import { requireModuleAccess } from '@/lib/requireModuleAccess'

export default async function Diagnostic({ params }: { params: ParamsType }) {
  requireModuleAccess('patients_clinical_data')
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
