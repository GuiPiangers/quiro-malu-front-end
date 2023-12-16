import SchedulingPatientForm from './components/SchedulingPatientForm'
import { patientService } from '@/services/patient/serverPatientService'
import { Validate } from '@/services/api/Validate'

export type SchedulingParamsType = { id: string; patientId: string }

export default async function patientData({
  params,
}: {
  params: SchedulingParamsType
}) {
  const patientId = params.patientId
  const patientData = await patientService
    .get(patientId)
    .then((res) => (Validate.isOk(res) ? res : undefined))

  return <>{patientData && <SchedulingPatientForm formData={patientData} />}</>
}
