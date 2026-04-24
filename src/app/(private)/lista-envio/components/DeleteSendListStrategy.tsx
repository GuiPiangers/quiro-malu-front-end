'use client'

import Button from '@/components/Button'
import ConfirmationModal, {
  type ModalRef,
} from '@/components/modal/ConfirmationModal'
import useSnackbarContext from '@/hooks/useSnackbarContext'
import { Validate } from '@/services/api/Validate'
import { deleteMessageSendStrategy } from '@/services/message/sendList'
import { useQueryClient } from '@tanstack/react-query'
import { Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useRef, useState } from 'react'

type DeleteSendListStrategyProps = {
  id: string
  listName: string
}

export default function DeleteSendListStrategy({
  id,
  listName,
}: DeleteSendListStrategyProps) {
  const { handleMessage } = useSnackbarContext()
  const router = useRouter()
  const queryClient = useQueryClient()
  const modalRef = useRef<ModalRef>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleOpen = () => modalRef.current?.openModal()
  const handleClose = () => modalRef.current?.closeModal()

  const handleDelete = useCallback(async () => {
    setIsDeleting(true)
    try {
      const res = await deleteMessageSendStrategy(id)
      if (Validate.isError(res)) {
        handleMessage({
          title: 'Erro!',
          description: res.message,
          type: 'error',
        })
        return
      }
      handleClose()
      await queryClient.invalidateQueries({
        queryKey: ['messageSendStrategies'],
      })
      router.refresh()
      handleMessage({
        title: 'Lista excluída com sucesso!',
        type: 'success',
      })
    } finally {
      setIsDeleting(false)
    }
  }, [handleMessage, id, queryClient, router])

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="small"
        color="red"
        className="shrink-0 px-2"
        disabled={isDeleting}
        onClick={(e) => {
          e.stopPropagation()
          handleOpen()
        }}
        aria-label="Excluir lista de envio"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
      <ConfirmationModal
        ref={modalRef}
        title="Excluir lista de envio?"
        description={`A lista "${listName}" será removida permanentemente. Esta ação não pode ser desfeita.`}
        buttonText={isDeleting ? 'Excluindo…' : 'Excluir'}
        buttonConfig={{ color: 'red' }}
        action={handleDelete}
      />
    </>
  )
}
