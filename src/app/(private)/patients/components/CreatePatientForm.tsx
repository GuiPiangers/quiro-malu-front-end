'use client'

import PatientDataForm, {
  CreatePatientData,
} from '../components/PatientDataForm'
import { clientPatientService } from '@/services/patient/clientPatientService'
import { useRouter } from 'next/navigation'

export default function CreatePatientForm() {
  const router = useRouter()

  const createPatient = async (data: CreatePatientData) => {
    const res = await clientPatientService.create(data)
    return res
  }

  const afterValidate = () => {
    router.push('/patients')
    router.refresh()
  }

  return (
    <section className="w-full">
      <PatientDataForm action={createPatient} afterValidate={afterValidate} />
    </section>
  )
}
