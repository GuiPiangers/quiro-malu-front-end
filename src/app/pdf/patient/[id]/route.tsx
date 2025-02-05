import PatientPdf from '@/pdf/patientPdf/PatientPdf'
import { Validate } from '@/services/api/Validate'
import {
  AnamnesisResponse,
  DiagnosticResponse,
  getAnamnesis,
  getDiagnostic,
  getPatient,
  LocationDTO,
  PatientResponse,
} from '@/services/patient/patient'
import {
  anamnesisPDFData,
  diagnosticPDFData,
  locationPDFData,
  patientPDFData,
} from '@/services/patientPDF/patientPdfTypes'
import { convertEntriesToObject } from '@/utils/convertEntriesToObject'
import { renderToStream } from '@react-pdf/renderer'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params: { id } }: { params: { id: string } },
) {
  const { searchParams } = new URL(request.url)
  const availableSearch = convertEntriesToObject(
    Array.from(searchParams.entries()),
  ) as {
    patient: string
    anamnesis: string
    diagnostic: string
    location: string
  }

  console.log(availableSearch.location)

  const patientAvailableFields = availableSearch?.patient
    ? JSON.parse(availableSearch?.patient)
    : {}
  const locationAvailableFields = availableSearch?.location
    ? JSON.parse(availableSearch?.location)
    : {}
  const anamnesisAvailableFields = availableSearch?.anamnesis
    ? JSON.parse(availableSearch?.anamnesis)
    : {}
  const diagnosticAvailableFields = availableSearch?.diagnostic
    ? JSON.parse(availableSearch?.diagnostic)
    : {}

  const patientPromise = getPatient(id)
  const anamnesisPromise = getAnamnesis(id)
  const diagnosticPromise = getDiagnostic(id)

  function validateSettler<T>(
    data: PromiseSettledResult<T>,
  ): data is PromiseFulfilledResult<T> {
    if (data.status === 'fulfilled') return true
    return false
  }

  const [patientData, anamnesisData, diagnosticData] = await Promise.allSettled(
    [patientPromise, anamnesisPromise, diagnosticPromise],
  )
  const patientDataResult =
    validateSettler(patientData) && Validate.isOk(patientData.value)
      ? patientData.value
      : undefined

  const anamnesisDataResult =
    validateSettler(anamnesisData) && Validate.isOk(anamnesisData.value)
      ? anamnesisData.value
      : undefined

  const diagnosticDataResult =
    validateSettler(diagnosticData) && Validate.isOk(diagnosticData.value)
      ? diagnosticData.value
      : undefined

  const filteredPatientData = Object.entries(patientAvailableFields).reduce(
    (acc, [key, value]) => {
      const newPatientObject: any = { ...acc }

      if (
        value &&
        patientDataResult &&
        patientDataResult[key as keyof patientPDFData]
      )
        newPatientObject[key as keyof patientPDFData] =
          patientDataResult[key as keyof patientPDFData]

      return newPatientObject
    },
    {} as patientPDFData,
  )

  const filteredLocationData = Object.entries(locationAvailableFields).reduce(
    (acc, [key, value]) => {
      const newLocationObject: any = { ...acc }
      if (
        value &&
        patientDataResult?.location &&
        patientDataResult.location[key as keyof LocationDTO]
      )
        newLocationObject[key] =
          patientDataResult.location[key as keyof LocationDTO]

      return newLocationObject
    },
    {} as locationPDFData,
  )

  const filteredAnamnesisData = Object.entries(anamnesisAvailableFields).reduce(
    (acc, [key, value]) => {
      const newAnamnesisObject: any = { ...acc }
      if (
        value &&
        anamnesisDataResult &&
        anamnesisDataResult[key as keyof typeof anamnesisDataResult]
      )
        newAnamnesisObject[key] =
          anamnesisDataResult[key as keyof typeof anamnesisDataResult]

      return newAnamnesisObject
    },
    {} as anamnesisPDFData,
  )

  const filteredDiagnosticData = Object.entries(
    diagnosticAvailableFields,
  ).reduce((acc, [key, value]) => {
    const newDiagnosticObject: any = { ...acc }
    if (
      value &&
      diagnosticDataResult &&
      diagnosticDataResult[key as keyof typeof diagnosticDataResult]
    )
      newDiagnosticObject[key] =
        diagnosticDataResult[key as keyof typeof diagnosticDataResult]

    return newDiagnosticObject
  }, {} as diagnosticPDFData)

  const stream = await renderToStream(
    <PatientPdf
      patientData={filteredPatientData}
      anamnesisData={filteredAnamnesisData}
      diagnosticData={filteredDiagnosticData}
      locationData={filteredLocationData}
    />,
  )
  return new NextResponse(stream as unknown as ReadableStream)
}
