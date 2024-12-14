import { Validate } from '@/services/api/Validate'
import { getDiagnostic } from '@/services/patient/patient'
import { FormButtons } from './FormButtons'
import { PageStage } from './RealizeScheduling'
import DiagnosticForm from '@/app/(private)/patients/[id]/diagnostic/components/DiagnosticForm'
import { useQuery, useQueryClient } from '@tanstack/react-query'

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
  const queryClient = useQueryClient()

  const { data: diagnosticData } = useQuery({
    queryKey: ['diagnostic', patientId],
    queryFn: async () =>
      await getDiagnostic(patientId).then((res) =>
        Validate.isOk(res) ? res : undefined,
      ),
  })

  const handleAfterValidate = () => {
    goToNextPage()
    queryClient.invalidateQueries({ queryKey: ['diagnostic', patientId] })
  }

  return (
    <DiagnosticForm
      formData={diagnosticData ?? { patientId }}
      afterValidate={handleAfterValidate}
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
