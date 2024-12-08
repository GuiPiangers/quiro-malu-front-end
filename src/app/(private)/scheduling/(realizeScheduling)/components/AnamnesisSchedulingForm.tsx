import AnamnesisForm from '@/app/(private)/patients/[id]/anamnesis/components/AnamnesisForm'
import { Validate } from '@/services/api/Validate'
import {
  AnamnesisResponse,
  getAnamnesis,
} from '@/services/patient/actions/patient'
import { useEffect, useState } from 'react'
import { FormButtons } from './FormButtons'
import { PageStage } from './RealizeScheduling'

type AnamnesisSchedulingFromProps = {
  patientId: string
  goToNextPage(): void
  setNextPage: (page: PageStage) => void
}

export default function AnamnesisSchedulingFrom({
  patientId,
  setNextPage,
  goToNextPage,
}: AnamnesisSchedulingFromProps) {
  const [anamnesisData, setAnamnesisData] = useState<AnamnesisResponse>()

  useEffect(() => {
    getAnamnesis(patientId).then(
      (res) => Validate.isOk(res) && setAnamnesisData(res),
    )
  }, [patientId])

  return (
    <AnamnesisForm
      formData={anamnesisData ?? { patientId }}
      afterValidate={goToNextPage}
      buttons={
        <FormButtons
          setNextPage={setNextPage}
          previousPage="record"
          nextPage="diagnostic"
        />
      }
    />
  )
}
