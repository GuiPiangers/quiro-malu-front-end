'use client'
import Button from '@/components/Button'
import ConfirmationModal from '@/components/modal/ConfirmationModal'
import { ModalHandles } from '@/components/modal/Modal'
import useSnackbarContext from '@/hooks/useSnackbarContext'
import { deletePatient } from '@/services/patient/patient'
import { useRouter } from 'next/navigation'
import { useCallback, useRef } from 'react'

type DeletePatientProps = { id: string }

export function DeletePatientModal({ id }: DeletePatientProps) {
  const { handleMessage } = useSnackbarContext()

  const router = useRouter()
  const modalHandle = useRef<ModalHandles>(null)

  const handleOpen = () => modalHandle.current?.openModal()
  const handleClose = () => modalHandle.current?.closeModal()

  const handleDeletePatient = useCallback(async () => {
    await deletePatient(id)
    handleClose()
    router.push('/patients')
    router.refresh()
    handleMessage({
      title: 'Paciente deletado com sucesso!',
      type: 'success',
    })
  }, [handleMessage, id, router])

  return (
    <>
      <Button variant="outline" size="small" color="red" onClick={handleOpen}>
        Excluir
      </Button>
      <ConfirmationModal
        title="Excluir paciente?"
        buttonText="Excluir"
        buttonConfig={{ color: 'red' }}
        description="Após excluir o paciente, a ação não poderá ser revertida"
        action={handleDeletePatient}
        ref={modalHandle}
      />
    </>
  )
}
