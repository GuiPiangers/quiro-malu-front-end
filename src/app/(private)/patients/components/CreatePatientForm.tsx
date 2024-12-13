'use client'

import useSnackbarContext from '@/hooks/useSnackbarContext'
import PatientDataForm, {
  CreatePatientData,
} from '../components/PatientDataForm'
import { useRouter } from 'next/navigation'
import { createPatient } from '@/services/patient/patient'

export default function CreatePatientForm() {
  const router = useRouter()

  const handleCreatePatient = async (data: CreatePatientData) => {
    const res = createPatient(data)
    return res
  }
  const { handleMessage } = useSnackbarContext()

  const afterValidate = () => {
    router.push('/patients')
    router.refresh()
    handleMessage({
      title: 'Paciente salvo com sucesso!',
      type: 'success',
    })
  }

  return (
    <section className="w-full">
      <PatientDataForm
        action={handleCreatePatient}
        afterValidate={afterValidate}
      />
    </section>
  )
}
