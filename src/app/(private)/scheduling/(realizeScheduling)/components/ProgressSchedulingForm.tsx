import ProgressForm from '@/app/(private)/patients/[id]/progress/components/ProgressForm'
import { PageStage } from './RealizeScheduling'
import { FormButtons } from './FormButtons'
import { clientPatientService } from '@/services/patient/clientPatientService'
import { ProgressResponse } from '@/services/patient/PatientService'
import { useEffect, useState } from 'react'
import { Validate } from '@/services/api/Validate'
import { clientSchedulingService } from '@/services/scheduling/clientScheduling'
import { useRouter } from 'next/navigation'

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

  console.log(schedulingId)

  useEffect(() => {
    schedulingId &&
      clientPatientService
        .getProgressByScheduling({ schedulingId, patientId })
        .then((res) => Validate.isOk(res) && setProgressData(res))
  }, [patientId, schedulingId])

  console.log(progressData)

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
        const progressRes = await clientPatientService.setProgress({
          ...data,
          schedulingId,
        })
        if (Validate.isOk(progressRes))
          await clientSchedulingService.realizeScheduling({
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
