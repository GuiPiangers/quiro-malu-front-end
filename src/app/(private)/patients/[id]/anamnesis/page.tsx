import { ParamsType } from '../page'
import AnamnesisForm from './components/AnamnesisForm'
import { Validate } from '@/services/api/Validate'
import { getAnamnesis } from '@/services/patient/patient'

export default async function Anamnesis({ params }: { params: ParamsType }) {
  const id = params.id
  const anamnesisData = await getAnamnesis(id).then((res) =>
    Validate.isOk(res) ? res : undefined,
  )

  return <AnamnesisForm formData={{ ...anamnesisData, patientId: id }} />
}
