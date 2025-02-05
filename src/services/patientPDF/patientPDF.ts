'use server'

import { redirect } from 'next/navigation'
import { PatientPdfProps } from './patientPdfTypes'

export async function generatePatientPDF({
  patientId,
  patientData,
  anamnesisData,
  diagnosticData,
  locationData,
}: PatientPdfProps & { patientId: string }) {
  const patientJSONData = JSON.stringify(patientData ?? {})
  const anamnesisJSONData = JSON.stringify(anamnesisData ?? {})
  const diagnosticJSONData = JSON.stringify(diagnosticData ?? {})
  const locationJSONData = JSON.stringify(locationData ?? {})

  redirect(
    `/pdf/patient/${patientId}?patient=${patientJSONData}&anamnesis=${anamnesisJSONData}&diagnostic=${diagnosticJSONData}&location=${locationJSONData}`,
  )
}
