import { patientService } from '@/services/patient/serverPatientService'
import UpdatePatientForm from '../components/UpdatePatientForm'

export type ParamsType = { id: string }

export default async function Patient({ params }: { params: ParamsType }) {
  const id = params.id
  const patientData = await patientService.get(id)

  return (
    <section aria-label="Dados do paciente" className="w-full">
      <UpdatePatientForm formData={patientData} />
    </section>
  )
}
