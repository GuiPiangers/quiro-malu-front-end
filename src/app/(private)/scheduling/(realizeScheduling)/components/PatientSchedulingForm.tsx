import PatientDataForm, {
  CreatePatientData,
} from '@/app/(private)/patients/components/PatientDataForm'
import Button from '@/components/Button'
import { responseError } from '@/services/api/api'
import { Validate } from '@/services/api/Validate'
import {
  PatientResponse,
  getPatient,
  updatePatient,
} from '@/services/patient/patient'
import { PageStage } from './RealizeScheduling'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { deepCompare } from '@/utils/deepCompare'

type PatientSchedulingFromProps = {
  patientId: string
  setNextPage: (page: PageStage) => void
  goToNextPage(): void
}

function PatientSchedulingButtons() {
  return (
    <Button color="green" variant="solid">
      Avançar
    </Button>
  )
}

export default function PatientSchedulingForm({
  patientId,
  goToNextPage,
  setNextPage,
}: PatientSchedulingFromProps) {
  const queryClient = useQueryClient()

  const { data: patientData } = useQuery({
    queryKey: ['patients', patientId],
    queryFn: async () =>
      await getPatient(patientId).then((res) =>
        Validate.isOk(res) ? res : undefined,
      ),
  })

  const handleAfterValidate = () => {
    setNextPage('anamnesis')
    goToNextPage()
    queryClient.invalidateQueries({ queryKey: ['patients', patientId] })
  }

  return (
    <PatientDataForm
      buttons={<PatientSchedulingButtons />}
      btWrapperClassName="justify-end"
      data={patientData}
      afterValidate={handleAfterValidate}
      action={async function (
        data: CreatePatientData | PatientResponse,
      ): Promise<PatientResponse | responseError> {
        const result = await updatePatient({
          id: patientId,
          name: data.name,
          phone: data.phone,
          cpf: data.cpf,
          gender: data.gender,
          location: data.location,
          dateOfBirth: data.dateOfBirth,
          education: data.education,
          maritalStatus: data.maritalStatus,
          profession: data.profession,
        })
        return result
      }}
    />
  )
}
