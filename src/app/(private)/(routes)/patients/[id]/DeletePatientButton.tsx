'use client'
import Button from '@/components/Button'
import Modal, { ModalContext, ModalHandles } from '@/components/modal/Modal'
import { clientPatientService } from '@/services/patient/clientPatientService'
import { useRouter } from 'next/navigation'
import { useCallback, useContext, useRef } from 'react'

type DeletePatientButtonProps = { id: string }

export function DeletePatientModal({ id }: DeletePatientButtonProps) {
  const router = useRouter()
  const modalHandle = useRef<ModalHandles>(null)

  const handleOpen = () => modalHandle.current?.openModal()
  const handleClose = () => modalHandle.current?.closeModal()

  const deletePatient = useCallback(async () => {
    await clientPatientService.delete(id)
    handleClose()
    router.push('/patients')
    router.refresh()
  }, [id])

  return (
    <>
      <Button variant="outline" size="small" color="red" onClick={handleOpen}>
        Excluir
      </Button>
      <Modal
        ref={modalHandle}
        className="flex max-w-sm flex-col items-center justify-center gap-2 p-8"
      >
        <h1 className="text-xl font-bold">Excluir paciente?</h1>

        <p className="text-sm">
          Após excluir o paciente, a ação não poderá ser revertida
        </p>

        <div className="mt-4 flex w-full justify-stretch gap-2">
          <Button
            color="black"
            variant="outline"
            className="w-full"
            onClick={handleClose}
          >
            Cancelar
          </Button>

          <Button className="w-full" color="red" onClick={deletePatient}>
            Excluir
          </Button>
        </div>
      </Modal>
    </>
  )
}
