import { patientService } from '@/services/patient/serverPatientService'
import { Box } from '@/components/Box/Box'
import ProgressForm from '../ProgressForm'

type ProgressParams = {
  id: string
  progressId: string
}

export default async function Progress({ params }: { params: ProgressParams }) {
  const { actualProblem, date, procedures, service, id } =
    await patientService.getProgress({
      id: params.progressId,
      patientId: params.id,
    })

  return (
    <ProgressForm
      formData={{
        actualProblem,
        date,
        procedures,
        service,
        id,
        patientId: params.id,
      }}
    />
  )
}
