import PatientDataForm, {
  CreatePatientData,
} from '@/app/(private)/patients/components/PatientDataForm'
import Button from '@/components/Button'
import { responseError } from '@/services/api/api'
import { Validate } from '@/services/api/Validate'
import {
  PatientResponse,
  getPatient,
  updatePatient,
} from '@/services/patient/patient'
import { useEffect, useState } from 'react'
import { PageStage } from './RealizeScheduling'

type PatientSchedulingFromProps = {
  patientId: string
  setNextPage: (page: PageStage) => void
  goToNextPage(): void
}

function PatientSchedulingButtons() {
  return (
    <Button color="green" variant="solid">
      Avançar
    </Button>
  )
}

export default function PatientSchedulingForm({
  patientId,
  goToNextPage,
  setNextPage,
}: PatientSchedulingFromProps) {
  const [patientData, setPatientData] = useState<PatientResponse>()

  useEffect(() => {
    getPatient(patientId).then(
      (res) => Validate.isOk(res) && setPatientData(res),
    )
  }, [patientId])

  return (
    <PatientDataForm
      buttons={<PatientSchedulingButtons />}
      btWrapperClassName="justify-end"
      data={patientData}
      afterValidate={goToNextPage}
      action={async function (
        data: CreatePatientData | PatientResponse,
      ): Promise<PatientResponse | responseError> {
        setNextPage('anamnesis')
        const result = await updatePatient({
          id: patientId,
          name: data.name,
          phone: data.phone,
          cpf: data.cpf,
          gender: data.gender,
          location: data.location,
          dateOfBirth: data.dateOfBirth,
          education: data.education,
          maritalStatus: data.maritalStatus,
          profession: data.profession,
        })
        return result
      }}
    />
  )
}
