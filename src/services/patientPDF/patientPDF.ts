'use server'

import { redirect } from 'next/navigation'
import { AvailablePatientPdf } from './patientPdfTypes'

export async function generatePatientPDF({
  patientId,
  patientData,
  anamnesisData,
  diagnosticData,
  locationData,
}: AvailablePatientPdf & { patientId: string }) {
  const patientJSONData = JSON.stringify({ ...patientData, name: true })
  const anamnesisJSONData = JSON.stringify(
    anamnesisData
      ? {
          ...anamnesisData,
          useMedicine: anamnesisData.medicines,
          underwentSurgery: anamnesisData.surgeries,
        }
      : {},
  )
  const diagnosticJSONData = JSON.stringify(diagnosticData ?? {})
  const locationJSONData = JSON.stringify(locationData ?? {})

  redirect(
    `/pdf/patient/${patientId}?patient=${patientJSONData}&anamnesis=${anamnesisJSONData}&diagnostic=${diagnosticJSONData}&location=${locationJSONData}`,
  )
}
