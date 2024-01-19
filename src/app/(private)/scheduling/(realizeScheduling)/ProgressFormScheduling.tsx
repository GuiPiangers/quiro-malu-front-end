import Button from '@/components/Button'
import ProgressForm from '../../patients/[id]/progress/components/ProgressForm'
import { ProgressResponse } from '@/services/patient/PatientService'

type ProgressFormSchedulingProps = {
  patientId: string
}

export default function ProgressFormScheduling({
  patientId,
}: ProgressFormSchedulingProps) {
  const afterSave = () => {
    return null
  }

  const formAction = async (data: ProgressResponse) => {
    return undefined
  }

  return (
    <ProgressForm
      formData={{ patientId }}
      formAction={formAction}
      afterValidation={afterSave}
      className="shadow-none"
      btWrapperClassName="flex-row-reverse w-full"
      buttons={
        <>
          <Button type="submit" color="green">
            Avançar
          </Button>
        </>
      }
    />
  )
}
