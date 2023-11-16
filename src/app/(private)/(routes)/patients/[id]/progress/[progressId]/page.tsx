import { patientService } from '@/services/patient/serverPatientService'
import { ParamsType } from '../../page'
import { Box } from '@/components/Box/Box'
import Button from '@/components/Button'
import SearchInput from '@/components/SearchInput'
import Link from 'next/link'

type ProgressParams = {
  id: string
  progressId: string
}

export default async function Progress({ params }: { params: ProgressParams }) {
  const { id: patientId, progressId } = params
  const progress = await patientService.getProgress({
    id: progressId,
    patientId,
  })

  return (
    <div className="w-full max-w-screen-lg space-y-4">
      <Box className="flex gap-8 rounded-2xl">
        <p>{progress.service}</p>
      </Box>
    </div>
  )
}
