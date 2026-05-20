'use client'

import Button from '@/components/Button'
import ConfirmationModal, {
  ModalRef,
} from '@/components/modal/ConfirmationModal'
import useSnackbarContext from '@/hooks/useSnackbarContext'
import { Validate } from '@/services/api/Validate'
import { deleteClinicUser } from '@/services/clinicUsers/clinicUsers'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useCallback, useRef, useState } from 'react'

type DeleteUserButtonProps = {
  userId: string
  userName: string
  onDeleted?(): void
  redirectTo?: string
}

export default function DeleteUserButton({
  userId,
  userName,
  onDeleted,
  redirectTo,
}: DeleteUserButtonProps) {
  const { handleMessage } = useSnackbarContext()
  const queryClient = useQueryClient()
  const router = useRouter()
  const modalRef = useRef<ModalRef>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleOpen = () => modalRef.current?.openModal()
  const handleClose = () => modalRef.current?.closeModal()

  const handleDelete = useCallback(async () => {
    setIsDeleting(true)
    try {
      const res = await deleteClinicUser({ id: userId })
      if (Validate.isError(res)) {
        handleMessage({
          title: 'Erro!',
          description: res.message,
          type: 'error',
        })
        return
      }
      handleClose()
      await queryClient.invalidateQueries({ queryKey: ['clinicUsers'] })
      await queryClient.invalidateQueries({ queryKey: ['clinicians'] })
      onDeleted?.()
      if (redirectTo) router.push(redirectTo)
      handleMessage({
        title: 'Usuário removido com sucesso!',
        type: 'success',
      })
    } finally {
      setIsDeleting(false)
    }
  }, [handleMessage, onDeleted, queryClient, redirectTo, router, userId])

  return (
    <>
      <Button
        type="button"
        variant="outline"
        color="red"
        disabled={isDeleting}
        onClick={handleOpen}
      >
        Excluir usuário
      </Button>
      <ConfirmationModal
        ref={modalRef}
        title="Excluir usuário?"
        description={`O usuário "${userName}" será removido da clínica. Agendamentos vinculados permanecem sem responsável. Esta ação não pode ser desfeita.`}
        buttonText={isDeleting ? 'Excluindo…' : 'Excluir'}
        buttonConfig={{ color: 'red' }}
        action={handleDelete}
      />
    </>
  )
}
