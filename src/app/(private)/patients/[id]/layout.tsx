import { Box } from '@/components/box/Box'
import Button from '@/components/Button'
import { Nav } from '@/components/navigation'
import DateTime from '@/utils/Date'
import { ReactNode } from 'react'
import { DeletePatientModal } from '../components/DeletePatient'
import { Validate } from '@/services/api/Validate'
import CreateSchedulingModal from '../../../../components/modal/SchedulingModal/SchedulingModal'
import Link from 'next/link'
import { getPatient } from '@/services/patient/patient'
import Phone from '@/utils/Phone'
import CreatePatientPDFModal from '@/components/modal/CreatePatientPDFModal/CreatePatientPDFModal'

type LayoutProps = {
  children: ReactNode
  params: {
    id: string
  }
}

export default async function Layout({ children, params }: LayoutProps) {
  const id = params.id
  const patientData = await getPatient(id).then((res) =>
    Validate.isOk(res) ? res : undefined,
  )
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
              <Button variant="outline" size="small" asChild>
                <Link
                  href={`https://wa.me/55${Phone.unformat(
                    patientData?.phone ?? '',
                  )}`}
                  target="_blank"
                >
                  Contato
                </Link>
              </Button>
              <CreatePatientPDFModal
                patientId={id}
                color="primary"
                variant="outline"
                size="small"
              >
                Gerar PDF
              </CreatePatientPDFModal>

              <DeletePatientModal id={patientData?.id || ''} />
            </div>
          </div>
        </section>
      </Box>

      <Nav.root className="m-auto max-w-screen-lg">
        <Nav.item replace href={`/patients/${id}`}>
          Dados
        </Nav.item>
        <Nav.item replace href={`/patients/${id}/progress`}>
          Evolução
        </Nav.item>
        <Nav.item replace href={`/patients/${id}/anamnesis`}>
          Anamnese
        </Nav.item>
        <Nav.item replace href={`/patients/${id}/exams`}>
          Exames
        </Nav.item>
        <Nav.item replace href={`/patients/${id}/diagnostic`}>
          Diagnóstico
        </Nav.item>
        <Nav.item replace href={`/patients/${id}/finance`}>
          Financeiro
        </Nav.item>
      </Nav.root>

      {children}
    </div>
  )
}
