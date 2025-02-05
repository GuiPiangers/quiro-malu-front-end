'use client'

import CreatePatientPDFModal from '@/components/modal/CreatePatientPDFModal/CreatePatientPDFModal'
import { generatePatientPDF } from '@/services/patientPDF/patientPDF'

export default function PdfViewPage() {
  return (
    <div>
      <CreatePatientPDFModal>Gerar PDF</CreatePatientPDFModal>
      <button
        onClick={async () => {
          await generatePatientPDF({
            patientId: 'e372ed46-8fb6-4914-8925-8a6bb1b84548',
            patientData: {
              name: 'Guilherme Eduardo',
              phone: '(51) 99999 9999',
            },
          })
        }}
      >
        Enviar paciente
      </button>
    </div>
  )
}
