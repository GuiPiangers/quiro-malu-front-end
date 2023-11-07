import { Box } from '@/components/Box/Box'
import PatientDataForm from './components/PatientDataForm'

export default function CreatePatient() {
  return (
    <section className="w-full">
      <Box className="m-auto w-full max-w-screen-lg">
        <PatientDataForm />
      </Box>
    </section>
  )
}
