'use client'
import Button from '@/components/Button'
import Modal, { ModalContext } from '@/components/modal/Modal'
import { clientPatientService } from '@/services/patient/clientPatientService'
import { useRouter } from 'next/navigation'
import { useCallback, useContext } from 'react'

type DeletePatientButtonProps = { id: string }

export function DeletePatientModal({ id }: DeletePatientButtonProps) {
  return (
    <Modal trigger={<DeletePatientButton id={id}></DeletePatientButton>}>
      isso
    </Modal>
  )
}

export default function DeletePatientButton({ id }: DeletePatientButtonProps) {
  const router = useRouter()
  const { handleOpen } = useContext(ModalContext)
  const deletePatient = useCallback(async () => {
    // await clientPatientService.delete(id)
    // router.push('/patients')
    // router.refresh()
  }, [id])
  return (
    <Button variant="outline" size="small" color="red" onClick={handleOpen}>
      Excluir
    </Button>
  )
}
