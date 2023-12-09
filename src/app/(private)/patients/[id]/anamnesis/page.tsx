import { patientService } from '@/services/patient/serverPatientService'
import { ParamsType } from '../page'
import AnamnesisForm from './components/AnamnesisForm'
import { Validate } from '@/services/api/Validate'

export default async function Anamnesis({ params }: { params: ParamsType }) {
  const id = params.id
  const anamnesisData = await patientService
    .getAnamnesis(id)
    .then((res) => (Validate.isOk(res) ? res : undefined))

  return <AnamnesisForm formData={{ ...anamnesisData, patientId: id }} />
}
