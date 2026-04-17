'use client'

import Button from '@/components/Button'
import ConfirmationModal, {
  ModalRef,
} from '@/components/modal/ConfirmationModal'
import useSnackbarContext from '@/hooks/useSnackbarContext'
import { Validate } from '@/services/api/Validate'
import { deleteBeforeScheduleMessage } from '@/services/message/beforeScheduleMessage'
import { Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useRef, useState } from 'react'

type DeleteBeforeScheduleCampaignProps = {
  id: string
  campaignName: string
}

export default function DeleteBeforeScheduleCampaign({
  id,
  campaignName,
}: DeleteBeforeScheduleCampaignProps) {
  const { handleMessage } = useSnackbarContext()
  const router = useRouter()
  const modalRef = useRef<ModalRef>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleOpen = () => modalRef.current?.openModal()
  const handleClose = () => modalRef.current?.closeModal()

  const handleDelete = useCallback(async () => {
    setIsDeleting(true)
    try {
      const res = await deleteBeforeScheduleMessage(id)
      if (Validate.isError(res)) {
        handleMessage({
          title: 'Erro!',
          description: res.message,
          type: 'error',
        })
        return
      }
      handleClose()
      router.refresh()
      handleMessage({
        title: 'Campanha excluída com sucesso!',
        type: 'success',
      })
    } finally {
      setIsDeleting(false)
    }
  }, [handleMessage, id, router])

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
        aria-label="Excluir campanha"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
      <ConfirmationModal
        ref={modalRef}
        title="Excluir campanha?"
        description={`A campanha "${campaignName}" será removida permanentemente. Esta ação não pode ser desfeita.`}
        buttonText={isDeleting ? 'Excluindo…' : 'Excluir'}
        buttonConfig={{ color: 'red' }}
        action={handleDelete}
      />
    </>
  )
}
