import { Validate } from '@/services/api/Validate'
import {
  DiagnosticResponse,
  getDiagnostic,
} from '@/services/patient/actions/patient'
import { useEffect, useState } from 'react'
import { FormButtons } from './FormButtons'
import { PageStage } from './RealizeScheduling'
import DiagnosticForm from '@/app/(private)/patients/[id]/diagnostic/components/DiagnosticForm'

type DiagnosticSchedulingFromProps = {
  patientId: string
  goToNextPage(): void
  setNextPage: (page: PageStage) => void
}

export default function DiagnosticSchedulingForm({
  patientId,
  setNextPage,
  goToNextPage,
}: DiagnosticSchedulingFromProps) {
  const [diagnosticData, setDiagnosticData] = useState<DiagnosticResponse>()

  useEffect(() => {
    getDiagnostic(patientId).then(
      (res) => Validate.isOk(res) && setDiagnosticData(res),
    )
  }, [patientId])

  return (
    <DiagnosticForm
      formData={diagnosticData ?? { patientId }}
      afterValidate={goToNextPage}
      buttons={
        <FormButtons
          setNextPage={setNextPage}
          previousPage="anamnesis"
          nextPage="progress"
        />
      }
    />
  )
}
