'use client'

import useSnackbarContext from '@/hooks/useSnackbarContext copy'
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
      <PatientDataForm action={createPatient} afterValidate={afterValidate} />
    </section>
  )
}
