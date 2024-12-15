import { Box } from '@/components/box/Box'
import { LoadingSpinner } from '@/components/skeleton/Spinner'

export default function LoadingPatient() {
  return (
    <Box className="flex h-full w-full max-w-screen-lg items-center justify-center py-6">
      <LoadingSpinner size={32} className="text-main"></LoadingSpinner>
    </Box>
  )
}
