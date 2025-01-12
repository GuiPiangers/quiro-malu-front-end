import AnamnesisForm from '@/app/(private)/patients/[id]/anamnesis/components/AnamnesisForm'
import { Validate } from '@/services/api/Validate'
import { getAnamnesis } from '@/services/patient/patient'
import { FormButtons } from './FormButtons'
import { PageStage } from './RealizeScheduling'
import { useQuery, useQueryClient } from '@tanstack/react-query'

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
  const queryClient = useQueryClient()

  const { data: anamnesisData } = useQuery({
    queryKey: ['anamnesis', patientId],
    queryFn: async () =>
      await getAnamnesis(patientId).then((res) =>
        Validate.isOk(res) ? res : undefined,
      ),
  })

  const handleAfterValidate = () => {
    goToNextPage()
    queryClient.invalidateQueries({
      queryKey: ['anamnesis', patientId],
    })
  }

  return (
    <AnamnesisForm
      formData={anamnesisData?.patientId ? anamnesisData : { patientId }}
      afterValidate={handleAfterValidate}
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
