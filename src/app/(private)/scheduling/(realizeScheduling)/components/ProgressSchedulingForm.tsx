import ProgressForm from '@/app/(private)/patients/[id]/progress/components/ProgressForm'
import { PageStage } from './RealizeScheduling'
import { FormButtons } from './FormButtons'
import {
  getProgressByScheduling,
  setProgress,
} from '@/services/patient/patient'
import { Validate } from '@/services/api/Validate'

import { realizeScheduling } from '@/services/scheduling/scheduling'
import { useQuery, useQueryClient } from '@tanstack/react-query'

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
  const queryClient = useQueryClient()

  const { data: progressData } = useQuery({
    queryKey: ['progress', { patientId, schedulingId }],
    queryFn: async () =>
      await getProgressByScheduling({ patientId, schedulingId }).then((res) =>
        Validate.isOk(res) ? res : undefined,
      ),
  })

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
        queryClient.invalidateQueries({
          queryKey: ['progress', { patientId, schedulingId }],
        })
        queryClient.invalidateQueries({ queryKey: ['listSchedules'] })
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
        service: progressData?.service ?? service,
        actualProblem: progressData?.actualProblem,
        procedures: progressData?.procedures,
      }}
    />
  )
}
