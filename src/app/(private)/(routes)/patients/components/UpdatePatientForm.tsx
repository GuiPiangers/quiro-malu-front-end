'use client'

import { PatientResponse } from '@/services/patient/PatientService'
import PatientDataForm from '../components/PatientDataForm'
import { clientPatientService } from '@/services/patient/clientPatientService'
import { useRouter } from 'next/navigation'

type UpdatePatientFormProps = {
  formData: PatientResponse
}

export default function UpdatePatientForm({
  formData,
}: UpdatePatientFormProps) {
  const router = useRouter()

  const updatePatient = async (data: PatientResponse) => {
    await clientPatientService.update({ id: formData.id, ...data })
    router.push('/patients')
    router.refresh()
  }

  return (
    <section className="w-full">
      <PatientDataForm action={updatePatient} data={formData} />
    </section>
  )
}
