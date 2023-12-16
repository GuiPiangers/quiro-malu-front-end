import { patientService } from '@/services/patient/serverPatientService'
import { SchedulingParamsType } from '../patientData/page'
import { Validate } from '@/services/api/Validate'
import SchedulingAnamnesisForm from './components/SchedulingAnamnesisForm'

export default async function Anamnesis({
  params,
}: {
  params: SchedulingParamsType
}) {
  const patientId = params.patientId
  const anamnesisData = await patientService
    .getAnamnesis(patientId)
    .then((res) => (Validate.isOk(res) ? res : undefined))

  return <SchedulingAnamnesisForm formData={{ ...anamnesisData, patientId }} />
}
