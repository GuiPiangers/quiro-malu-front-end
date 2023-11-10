'use client'

import PatientDataForm, {
  CreatePatientData,
} from '../components/PatientDataForm'
import { clientPatientService } from '@/services/patient/clientPatientService'
import { useRouter } from 'next/navigation'

export default function CreatePatientForm() {
  const router = useRouter()

  const createPatient = async (data: CreatePatientData) => {
    await clientPatientService.create(data)
    router.push('/patients')
    router.refresh()
  }

  return (
    <section className="w-full">
      <PatientDataForm action={createPatient} />
    </section>
  )
}
