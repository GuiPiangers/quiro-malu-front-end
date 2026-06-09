import { Box } from '@/components/box/Box'
import PatientsFile from '@/components/form/patients/UploadPatientsForm'

export default function Page() {
  return (
    <section className="w-full max-w-screen-md" aria-label="importar pacientes">
      <Box>
        <div className="space-y-2">
          <PatientsFile />
        </div>
      </Box>
    </section>
  )
}
