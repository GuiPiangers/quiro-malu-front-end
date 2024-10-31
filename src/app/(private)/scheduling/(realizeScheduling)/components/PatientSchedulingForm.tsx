import PatientDataForm, {
  CreatePatientData,
} from '@/app/(private)/patients/components/PatientDataForm'
import Button from '@/components/Button'
import { responseError } from '@/services/api/api'
import { Validate } from '@/services/api/Validate'
import { clientPatientService } from '@/services/patient/clientPatientService'
import { PatientResponse } from '@/services/patient/PatientService'
import { MutableRefObject, useEffect, useState } from 'react'

type PatientSchedulingFromProps = {
  patientId: string
  nextPage: MutableRefObject<
    'progress' | 'payment' | 'anamnesis' | 'diagnostic' | 'record'
  >
  goToNextPage(): void
}

function PatientSchedulingButtons() {
  return <Button color="green">Avançar</Button>
}

export default function PatientSchedulingForm({
  patientId,
  goToNextPage,
  nextPage,
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
      btWrapperClassName="justify-end"
      data={patientData}
      afterValidate={goToNextPage}
      action={async function (
        data: CreatePatientData | PatientResponse,
      ): Promise<PatientResponse | responseError> {
        nextPage.current = 'anamnesis'
        return data as PatientResponse
      }}
    />
  )
}
