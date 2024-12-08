'use client'

import Button from '@/components/Button'
import useSnackbarContext from '@/hooks/useSnackbarContext'
import { deleteScheduling } from '@/services/scheduling/actions/scheduling'
import { useRouter } from 'next/navigation'

export default function DeleteSchedulingButton({ id }: { id: string }) {
  const router = useRouter()
  const { handleMessage } = useSnackbarContext()
  const handleDeleteScheduling = async () => {
    await deleteScheduling({ id })
    router.refresh()
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
