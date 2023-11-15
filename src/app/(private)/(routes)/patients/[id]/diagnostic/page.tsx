import { ParamsType } from '../page'
import { patientService } from '@/services/patient/serverPatientService'
import DiagnosticForm from './DiagnosticForm'

export default async function Diagnostic({ params }: { params: ParamsType }) {
  const id = params.id
  const patientData = await patientService.getDiagnostic(id)

  return <DiagnosticForm formData={patientData} />
}
