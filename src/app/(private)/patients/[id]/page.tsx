import UpdatePatientForm from '../components/UpdatePatientForm'
import { Validate } from '@/services/api/Validate'
import { getPatient } from '@/services/patient/patient'

export type ParamsType = { id: string }

export default async function Patient({ params }: { params: ParamsType }) {
  const id = params.id
  const patientData = await getPatient(id).then((res) =>
    Validate.isOk(res) ? res : undefined,
  )

  return (
    <section aria-label="Dados do paciente" className="w-full">
      {patientData && <UpdatePatientForm formData={patientData} />}
    </section>
  )
}
