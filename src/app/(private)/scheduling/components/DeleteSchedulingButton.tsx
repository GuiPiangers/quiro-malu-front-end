'use client'

import Button from '@/components/Button'
import { useDeleteScheduling } from '@/hooks/scheduling/useDeleteScheduling'
import useSnackbarContext from '@/hooks/useSnackbarContext'

export default function DeleteSchedulingButton({ id }: { id: string }) {
  const deleteScheduling = useDeleteScheduling()
  const { handleMessage } = useSnackbarContext()

  const handleDeleteScheduling = async () => {
    deleteScheduling.mutate({ id })

    handleMessage({
      title: 'Agendamento deletado com sucesso!',
      type: 'success',
    })
  }
  return (
    <Button
      onClick={handleDeleteScheduling}
      variant="outline"
      size="small"
      color="red"
      className="w-20"
    >
      Excluir
    </Button>
  )
}
