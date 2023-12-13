'use client'

import Button from '@/components/Button'
import useSnackbarContext from '@/hooks/useSnackbarContext copy'
import { clientSchedulingService } from '@/services/scheduling/clientScheduling'
import { useRouter } from 'next/navigation'

export default function DeleteSchedulingButton({ id }: { id: string }) {
  const router = useRouter()
  const { handleMessage } = useSnackbarContext()
  const deleteScheduling = async () => {
    await clientSchedulingService.delete({ id })
    router.refresh()
    handleMessage({
      title: 'Agendamento deletado com sucesso!',
      type: 'success',
    })
  }
  return (
    <Button
      onClick={deleteScheduling}
      variant="outline"
      size="small"
      color="red"
      className="w-20"
    >
      Excluir
    </Button>
  )
}
