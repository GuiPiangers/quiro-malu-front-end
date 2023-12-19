'use client'

import { PatientResponse } from '@/services/patient/PatientService'
import PatientDataForm from '@/app/(private)/patients/components/PatientDataForm'
import { clientPatientService } from '@/services/patient/clientPatientService'
import { usePathname, useRouter } from 'next/navigation'
import Button from '@/components/Button'
import Link from 'next/link'

type UpdatePatientFormProps = {
  formData: PatientResponse
}

export default function SchedulingPatientForm({
  formData,
}: UpdatePatientFormProps) {
  const router = useRouter()
  const path = usePathname()
    .split('/')
    .filter((p, index, arr) => index < arr.length - 1)
    .join('/')

  const updatePatient = async (data: PatientResponse) => {
    return await clientPatientService.update({ id: formData.id, ...data })
  }

  const afterValidate = () => {
    router.replace(`${path}/anamnesis`)
  }

  return (
    <section className="w-full">
      <PatientDataForm
        btWrapperClassName="justify-between flex-row-reverse"
        buttons={
          <>
            <Button color="green" type="submit">
              Avançar
            </Button>
            <Button
              variant="outline"
              color="red"
              type="button"
              onClick={router.back}
            >
              Cancelar
            </Button>
          </>
        }
        action={updatePatient}
        data={formData}
        afterValidate={afterValidate}
      />
    </section>
  )
}
