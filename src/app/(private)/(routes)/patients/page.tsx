import { Box } from '@/components/Box/Box'
import Button from '@/components/Button'
import SearchInput from '@/components/SearchInput'
import { AccordionTable } from '@/components/accordionTable'
import Link from 'next/link'
import { patientService } from '@/services/patient/serverPatientService'

export default async function Patients() {
  const patients = await patientService.list()
  const generateTable = () => {
    return patients.map((patient) => {
      return (
        <AccordionTable.Item key={patient.id}>
          <AccordionTable.Row columns={['1fr', '1fr', '80px']}>
            <AccordionTable.Cell>{patient.name}</AccordionTable.Cell>
            <AccordionTable.Cell>{patient.phone}</AccordionTable.Cell>
            <Button
              asChild
              variant="outline"
              size="small"
              className="justify-self-stretch"
            >
              <Link href={`/patients/${patient.id}`}>Fixa</Link>
            </Button>
          </AccordionTable.Row>
          <AccordionTable.Content className="flex justify-between gap-2">
            <div className="space-y-1 text-sm">
              <p>
                <strong>Nome:</strong> {patient.name}
              </p>
              <p>
                <strong>Telefone:</strong> {patient.phone}
              </p>
              <p>
                <strong>Idade:</strong> {patient.dateOfBirth}
              </p>
            </div>
            <div className="flex w-28 flex-col gap-2">
              <Button variant="outline" size="small">
                Contato
              </Button>
              <Button variant="outline" size="small">
                Agendar
              </Button>
            </div>
          </AccordionTable.Content>
        </AccordionTable.Item>
      )
    })
  }

  return (
    <main className="w-full max-w-6xl">
      <Box>
        <div className="mb-6 grid grid-cols-[1fr_auto] items-center gap-8">
          <SearchInput className="text-base" />
          <Button asChild color="green">
            <Link href="/patients/create">Cadastrar</Link>
          </Button>
        </div>

        <AccordionTable.Root className="text-sm">
          {generateTable()}
        </AccordionTable.Root>
      </Box>
    </main>
  )
}
