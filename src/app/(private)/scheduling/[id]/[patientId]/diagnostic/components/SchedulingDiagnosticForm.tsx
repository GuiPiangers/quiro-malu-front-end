'use client'

import DiagnosticForm from '@/app/(private)/patients/[id]/diagnostic/components/DiagnosticForm'
import Button from '@/components/Button'
import { DiagnosticResponse } from '@/services/patient/PatientService'
import { usePathname, useRouter } from 'next/navigation'
import { useRef } from 'react'

type SchedulingDiagnostic = {
  formData: Partial<DiagnosticResponse>
}

export default function SchedulingDiagnosticForm({
  formData,
}: SchedulingDiagnostic) {
  const router = useRouter()
  const refIsBackBt = useRef<boolean>()
  const path = usePathname()
    .split('/')
    .filter((p, index, arr) => index < arr.length - 1)
    .join('/')

  const afterValidate = () => {
    router.refresh()
    if (refIsBackBt.current === true) {
      router.replace(`${path}/anamnesis`)
    } else {
      router.replace(`${path}/finance`)
    }
  }

  return (
    <DiagnosticForm
      formData={formData}
      afterValidate={afterValidate}
      btWrapperClassName="flex-row-reverse justify-between"
      buttons={
        <>
          <div className="flex flex-row-reverse gap-4">
            <Button
              color="green"
              type="submit"
              onClick={() => (refIsBackBt.current = false)}
            >
              Avançar
            </Button>

            <Button
              color="black"
              variant="outline"
              type="submit"
              onClick={() => (refIsBackBt.current = true)}
            >
              Voltar
            </Button>
          </div>

          <Button color="red" variant="outline" type="button">
            Cancelar
          </Button>
        </>
      }
    />
  )
}
