import ProgressForm from '@/app/(private)/patients/[id]/progress/components/ProgressForm'
import { PageStage } from './RealizeScheduling'
import { FormButtons } from './FormButtons'
import {
  ProgressResponse,
  getProgressByScheduling,
  setProgress,
} from '@/services/patient/actions/patient'
import { useEffect, useState } from 'react'
import { Validate } from '@/services/api/Validate'
import { useRouter } from 'next/navigation'

import { realizeScheduling } from '@/services/scheduling/actions/scheduling'

type ProgressSchedulingFormProps = {
  goToNextPage(): void
  setNextPage: (page: PageStage) => void
  schedulingData: {
    date: string
    patientId: string
    service: string
    schedulingId: string
  }
}

export function ProgressSchedulingForm({
  goToNextPage,
  setNextPage,
  schedulingData: { date, patientId, service, schedulingId },
}: ProgressSchedulingFormProps) {
  const [progressData, setProgressData] = useState<ProgressResponse>()
  const router = useRouter()

  useEffect(() => {
    schedulingId &&
      getProgressByScheduling({ schedulingId, patientId }).then(
        (res) => Validate.isOk(res) && setProgressData(res),
      )
  }, [patientId, schedulingId])

  return (
    <ProgressForm
      buttons={
        <FormButtons
          setNextPage={setNextPage}
          previousPage="diagnostic"
          nextPage="payment"
        />
      }
      afterValidation={() => {
        goToNextPage()
        router.refresh()
      }}
      formAction={async (data) => {
        const progressRes = await setProgress({
          ...data,
          schedulingId,
        })
        if (Validate.isOk(progressRes))
          await realizeScheduling({
            id: schedulingId,
            patientId,
          })
        return progressRes
      }}
      formData={{
        id: progressData?.id,
        patientId,
        date,
        service,
        actualProblem: progressData?.actualProblem,
        procedures: progressData?.procedures,
      }}
    />
  )
}
