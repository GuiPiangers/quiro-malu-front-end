import PatientDataForm, {
  CreatePatientData,
} from '@/app/(private)/patients/components/PatientDataForm'
import Button from '@/components/Button'
import { responseError } from '@/services/api/api'
import { Validate } from '@/services/api/Validate'
import { clientPatientService } from '@/services/patient/clientPatientService'
import { PatientResponse } from '@/services/patient/PatientService'
import { useEffect, useState } from 'react'

type PatientSchedulingFromProps = {
  patientId: string
}

function PatientSchedulingButtons() {
  return <Button>Avançar</Button>
}

export default function PatientSchedulingFrom({
  patientId,
}: PatientSchedulingFromProps) {
  const [patientData, setPatientData] = useState<PatientResponse>()
  useEffect(() => {
    clientPatientService
      .get(patientId)
      .then((res) => Validate.isOk(res) && setPatientData(res))
  }, [patientId])
  return (
    <PatientDataForm
      buttons={<PatientSchedulingButtons />}
      data={patientData}
      action={function (
        data: CreatePatientData | PatientResponse,
      ): Promise<PatientResponse | responseError> {
        throw new Error('Function not implemented.')
      }}
    />
  )
}
