'use client'

import Button from '@/components/Button'
import ConfirmationModal, {
  ModalRef,
} from '@/components/modal/ConfirmationModal'
import useSnackbarContext from '@/hooks/useSnackbarContext'
import { Validate } from '@/services/api/Validate'
import { deleteRole } from '@/services/rbac/rbac'
import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useRef, useState } from 'react'

type DeleteRoleButtonProps = {
  roleId: string
  roleName: string
  onDeleted?(): void
}

export default function DeleteRoleButton({
  roleId,
  roleName,
  onDeleted,
}: DeleteRoleButtonProps) {
  const { handleMessage } = useSnackbarContext()
  const queryClient = useQueryClient()
  const modalRef = useRef<ModalRef>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleOpen = () => modalRef.current?.openModal()
  const handleClose = () => modalRef.current?.closeModal()

  const handleDelete = useCallback(async () => {
    setIsDeleting(true)
    try {
      const res = await deleteRole({ id: roleId })
      if (Validate.isError(res)) {
        handleMessage({
          title: 'Erro!',
          description: res.message,
          type: 'error',
        })
        return
      }
      handleClose()
      await queryClient.invalidateQueries({ queryKey: ['roles'] })
      onDeleted?.()
      handleMessage({
        title: 'Função excluída com sucesso!',
        type: 'success',
      })
    } finally {
      setIsDeleting(false)
    }
  }, [handleMessage, onDeleted, queryClient, roleId])

  return (
    <>
      <Button
        type="button"
        variant="outline"
        color="red"
        disabled={isDeleting}
        onClick={handleOpen}
      >
        Excluir
      </Button>
      <ConfirmationModal
        ref={modalRef}
        title="Excluir função?"
        description={`A função "${roleName}" será removida permanentemente. Usuários vinculados precisarão de outro papel. Esta ação não pode ser desfeita.`}
        buttonText={isDeleting ? 'Excluindo…' : 'Excluir'}
        buttonConfig={{ color: 'red' }}
        action={handleDelete}
      />
    </>
  )
}
