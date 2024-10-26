import { Box } from '@/components/box/Box'
import Button from '@/components/Button'
import { Nav } from '@/components/navigation'
import { patientService } from '@/services/patient/serverPatientService'
import DateTime from '@/utils/Date'
import { ReactNode } from 'react'
import { DeletePatientModal } from '../components/DeletePatient'
import { Validate } from '@/services/api/Validate'
import CreateSchedulingModal from '../../scheduling/components/SchedulingModal'

type LayoutProps = {
  children: ReactNode
  params: {
    id: string
  }
}

export default async function Layout({ children, params }: LayoutProps) {
  const id = params.id
  const patientData = await patientService
    .get(id)
    .then((res) => (Validate.isOk(res) ? res : undefined))
  return (
    <div className="flex w-full flex-col items-center gap-4">
      <Box asChild className="w-full max-w-screen-lg">
        <section aria-label="Dados do paciente">
          <div className="flex justify-between">
            <div className="flex flex-col gap-1">
              <span className="font-semibold">{patientData?.name}</span>
              <span className="text-xs">
                {`Registrado em ${
                  patientData?.createAt &&
                  DateTime.getLocaleDate(patientData.createAt)
                }`}
              </span>
              <span className="text-xs">{patientData?.phone}</span>
              {patientData?.dateOfBirth && (
                <span className="text-xs">
                  {DateTime.calcAge(patientData?.dateOfBirth) + ' anos'}
                  {patientData?.gender && ' - ' + patientData?.gender}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Button variant="outline" size="small">
                Contato
              </Button>
              <CreateSchedulingModal
                color="primary"
                variant="outline"
                size="small"
              >
                Agendar horário
              </CreateSchedulingModal>
              <DeletePatientModal id={patientData?.id || ''} />
            </div>
          </div>
        </section>
      </Box>

      <Nav.root className="m-auto max-w-screen-lg">
        <Nav.item href={`/patients/${id}`}>Dados</Nav.item>
        <Nav.item href={`/patients/${id}/progress`}>Evolução</Nav.item>
        <Nav.item href={`/patients/${id}/anamnesis`}>Anamnese</Nav.item>
        <Nav.item href={`/patients/${id}/exams`}>Exames</Nav.item>
        <Nav.item href={`/patients/${id}/diagnostic`}>Diagnóstico</Nav.item>
        <Nav.item href={`/patients/${id}/finance`}>Financeiro</Nav.item>
      </Nav.root>

      {children}
    </div>
  )
}
