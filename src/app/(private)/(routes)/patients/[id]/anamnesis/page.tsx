import { patientService } from '@/services/patient/serverPatientService'
import { ParamsType } from '../page'
import AnamnesisForm from './AnamnesisForm'

export default async function Anamnesis({ params }: { params: ParamsType }) {
  const id = params.id
  const patientData = await patientService.getAnamnesis(id)

  return <AnamnesisForm formData={patientData} />
}
