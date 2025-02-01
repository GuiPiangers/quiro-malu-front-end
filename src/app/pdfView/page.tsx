'use client'

import PatientPdf from '@/pdf/patientPdf/PatientPdf'
import { PDFViewer } from '@react-pdf/renderer'

export default function PdfViewPage() {
  return (
    <div>
      <PDFViewer className="h-screen w-full">
        <PatientPdf />
      </PDFViewer>
    </div>
  )
}
