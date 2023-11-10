import { Box } from '@/components/Box/Box'
import Button from '@/components/Button'
import { Nav } from '@/components/navigation'
import { patientService } from '@/services/patient/serverPatientService'
import Age from '@/utils/Age'
import PatientDataForm from '../components/PatientDataForm'
import UpdatePatientForm from '../components/UpdatePatientForm'

export default async function Patient({ params }: { params: { id: string } }) {
  const id = params.id
  const patientData = await patientService.get(id)

  return (
    <section aria-label="Dados do paciente" className="w-full">
      <UpdatePatientForm formData={patientData} />
    </section>
  )
}
