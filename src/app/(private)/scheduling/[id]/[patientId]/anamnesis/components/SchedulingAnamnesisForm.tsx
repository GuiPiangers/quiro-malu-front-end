'use client'

import AnamnesisForm from '@/app/(private)/patients/[id]/anamnesis/components/AnamnesisForm'
import Button from '@/components/Button'
import { AnamnesisResponse } from '@/services/patient/PatientService'
import { usePathname, useRouter } from 'next/navigation'
import { useRef, useState } from 'react'

type SchedulingAnamnesisForm = {
  formData: AnamnesisResponse
}

export default function SchedulingAnamnesisForm({
  formData,
}: SchedulingAnamnesisForm) {
  const router = useRouter()
  const refIsBackBt = useRef<boolean>()
  const path = usePathname()
    .split('/')
    .filter((p, index, arr) => index < arr.length - 1)
    .join('/')

  const afterValidate = () => {
    router.refresh()
    if (refIsBackBt.current === true) {
      router.replace(`${path}/patientData`)
    } else {
      router.replace(`${path}/diagnostic`)
    }
  }

  return (
    <AnamnesisForm
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
