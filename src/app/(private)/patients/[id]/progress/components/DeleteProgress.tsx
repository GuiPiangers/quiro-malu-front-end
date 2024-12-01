'use client'
import Button from '@/components/Button'
import ConfirmationModal from '@/components/modal/ConfirmationModal'
import { ModalHandles } from '@/components/modal/Modal'
import useSnackbarContext from '@/hooks/useSnackbarContext'
import { clientPatientService } from '@/services/patient/clientPatientService'
import { useRouter } from 'next/navigation'
import { useCallback, useRef } from 'react'

type DeleteProgressProps = { id: string; patientId: string }

export default function DeleteProgress({ id, patientId }: DeleteProgressProps) {
  const { handleMessage } = useSnackbarContext()

  const router = useRouter()
  const modalHandle = useRef<ModalHandles>(null)

  const handleOpen = () => modalHandle.current?.openModal()
  const handleClose = () => modalHandle.current?.closeModal()

  const deletePatient = async () => {
    await clientPatientService.deleteProgress({ id, patientId })
    handleClose()
    router.refresh()
    handleMessage({
      title: 'Evolução excluída com sucesso!',
      type: 'success',
    })
  }

  return (
    <>
      <Button
        onClick={handleOpen}
        size="small"
        variant="outline"
        color="red"
        className="w-20"
      >
        Excluir
      </Button>
      <ConfirmationModal
        title="Excluir evolução?"
        buttonText="Excluir"
        buttonConfig={{ color: 'red' }}
        description="Após excluir a evolução, a ação não poderá ser revertida"
        action={deletePatient}
        ref={modalHandle}
      />
    </>
  )
}
