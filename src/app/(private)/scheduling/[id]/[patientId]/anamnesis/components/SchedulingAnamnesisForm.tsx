'use client'

import AnamnesisForm from '@/app/(private)/patients/[id]/anamnesis/components/AnamnesisForm'
import { AnamnesisResponse } from '@/services/patient/PatientService'
import { useRouter } from 'next/navigation'

type SchedulingAnamnesisForm = {
  formData: AnamnesisResponse
}

export default function SchedulingAnamnesisForm({
  formData,
}: SchedulingAnamnesisForm) {
  const router = useRouter()

  const afterValidate = () => {
    router.push('/diagnostic')
  }

  return <AnamnesisForm formData={formData} afterValidate={afterValidate} />
}
