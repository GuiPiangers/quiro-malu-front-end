'use client'

import { PatientResponse, updatePatient } from '@/services/patient/patient'
import PatientDataForm from '../components/PatientDataForm'
import useSnackbarContext from '@/hooks/useSnackbarContext'

type UpdatePatientFormProps = {
  formData: PatientResponse
}

export default function UpdatePatientForm({
  formData,
}: UpdatePatientFormProps) {
  const handleUpdatePatient = async (data: PatientResponse) => {
    return await updatePatient({ id: formData.id, ...data })
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
        action={handleUpdatePatient}
        data={formData}
        afterValidate={afterValidate}
      />
    </section>
  )
}
