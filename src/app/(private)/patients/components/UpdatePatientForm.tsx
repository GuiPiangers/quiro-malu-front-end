'use client'

import { PatientResponse } from '@/services/patient/PatientService'
import PatientDataForm from '../components/PatientDataForm'
import { clientPatientService } from '@/services/patient/clientPatientService'
import { useRouter } from 'next/navigation'
import useSnackbarContext from '@/hooks/useSnackbarContext copy'

type UpdatePatientFormProps = {
  formData: PatientResponse
}

export default function UpdatePatientForm({
  formData,
}: UpdatePatientFormProps) {
  const router = useRouter()
  const updatePatient = async (data: PatientResponse) => {
    return await clientPatientService.update({ id: formData.id, ...data })
  }
  const { handleMessage } = useSnackbarContext()

  const afterValidate = () => {
    handleMessage({
      title: 'Paciente salvo com sucesso!',
      type: 'success',
    })
  }

  return (
    <section className="w-full">
      <PatientDataForm
        action={updatePatient}
        data={formData}
        afterValidate={afterValidate}
      />
    </section>
  )
}
