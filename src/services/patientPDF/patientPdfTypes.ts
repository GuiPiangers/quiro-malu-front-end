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

export type AvailablePatientPdf = {
  patientData: Record<keyof Partial<Omit<patientPDFData, 'name'>>, boolean>
  locationData?: Record<keyof locationPDFData, boolean>
  anamnesisData?: Record<
    keyof Omit<anamnesisPDFData, 'useMedicine' | 'underwentSurgery'>,
    boolean
  >
  diagnosticData?: Record<keyof diagnosticPDFData, boolean>
}
