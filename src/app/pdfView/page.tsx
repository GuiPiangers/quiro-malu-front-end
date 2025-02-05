'use client'

import CreatePatientPDFModal from '@/components/modal/CreatePatientPDFModal/CreatePatientPDFModal'
import { generatePatientPDF } from '@/services/patientPDF/patientPDF'

export default function PdfViewPage() {
  return (
    <div>
      <CreatePatientPDFModal>Gerar PDF</CreatePatientPDFModal>
      <button>Enviar paciente</button>
    </div>
  )
}
