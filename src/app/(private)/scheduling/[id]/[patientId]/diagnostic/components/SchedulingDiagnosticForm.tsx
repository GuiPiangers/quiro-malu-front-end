'use client'

import DiagnosticForm from '@/app/(private)/patients/[id]/diagnostic/components/DiagnosticForm'
import { DiagnosticResponse } from '@/services/patient/PatientService'
import { useRouter } from 'next/navigation'

type SchedulingDiagnostic = {
  formData: Partial<DiagnosticResponse>
}

export default function SchedulingDiagnosticForm({
  formData,
}: SchedulingDiagnostic) {
  const router = useRouter()

  const afterValidate = () => {
    router.push('/finance')
  }

  return <DiagnosticForm formData={formData} afterValidate={afterValidate} />
}
