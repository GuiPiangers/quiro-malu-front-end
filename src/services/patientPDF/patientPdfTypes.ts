import {
  AnamnesisResponse,
  DiagnosticResponse,
  LocationDTO,
  PatientResponse,
} from '../patient/patient'

export type patientPDFData = Omit<
  PatientResponse,
  'location' | 'id' | 'createAt'
>
export type diagnosticPDFData = Partial<Omit<DiagnosticResponse, 'patientId'>>
export type anamnesisPDFData = Partial<Omit<AnamnesisResponse, 'patientId'>>
export type locationPDFData = Partial<LocationDTO>

export type PatientPdfProps = {
  patientData: patientPDFData
  locationData?: locationPDFData
  anamnesisData?: anamnesisPDFData
  diagnosticData?: diagnosticPDFData
}
