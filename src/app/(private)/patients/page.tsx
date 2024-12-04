import { Box } from '@/components/box/Box'
import Button from '@/components/Button'
import SearchInput from '@/components/input/SearchInput'
import { AccordionTable } from '@/components/accordionTable'
import Link from 'next/link'
import { patientService } from '@/services/patient/serverPatientService'
import DateTime from '@/utils/Date'
import NoDataFound from '@/components/NoDataFound'
import Pagination from '@/components/pagination/Pagination'
import { Validate } from '@/services/api/Validate'
import CreateSchedulingModal from '../scheduling/components/SchedulingModal'

export default async function Patients({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined }
}) {
  const page =
    searchParams.page && +searchParams.page > 0 ? searchParams.page : '1'

  const patientData = await patientService.list({ page })

  const generateTable = () => {
    if (Validate.isOk(patientData) && patientData.patients.length > 0) {
      return patientData.patients.map((patient) => {
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
                <Link href={`/patients/${patient.id}`}>Ficha</Link>
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
                {patient.dateOfBirth && (
                  <p>
                    <strong>Idade:</strong>{' '}
                    {`${DateTime.calcAge(patient.dateOfBirth)} anos`}
                  </p>
                )}
              </div>
              <div className="flex w-28 flex-col gap-2">
                <Button variant="outline" size="small" asChild>
                  <Link
                    href={`https://wa.me/55${patient.phone}`}
                    target="_blank"
                  >
                    Contato
                  </Link>
                </Button>
                <CreateSchedulingModal
                  color="primary"
                  variant="outline"
                  size="small"
                  formData={{
                    patient: patient.name,
                    patientId: patient.id,
                    patientPhone: patient.phone,
                  }}
                >
                  Agendar
                </CreateSchedulingModal>
              </div>
            </AccordionTable.Content>
          </AccordionTable.Item>
        )
      })
    }
    return (
      <NoDataFound
        message={
          <div className="items center mt-4 flex flex-col gap-2">
            <span>Nenhum paciente encontrado</span>
            <Button asChild size="small" variant="outline" color="green">
              <Link href="/patients/create">Cadastrar paciente</Link>
            </Button>
          </div>
        }
      />
    )
  }

  return (
    <main className="w-full max-w-screen-lg">
      <Box>
        <div className="mb-6 grid grid-cols-1 items-center gap-4 sm:grid-cols-[1fr_auto]">
          <SearchInput className="text-base" />
          <Button asChild color="green">
            <Link href="/patients/create">Cadastrar</Link>
          </Button>
        </div>

        <AccordionTable.Root className="text-sm">
          {generateTable()}
        </AccordionTable.Root>
      </Box>
      <div className="mt-4 grid place-items-center">
        {Validate.isOk(patientData) && (
          <Pagination
            limit={patientData.limit}
            page={+page}
            total={patientData.total}
          />
        )}
      </div>
    </main>
  )
}
