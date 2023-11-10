'use client'
import { RxArrowLeft } from 'react-icons/rx'

import Button from '@/components/Button'
import { useRouter } from 'next/navigation'

export default function PreviousButton() {
  const router = useRouter()
  return (
    <Button
      size="small"
      variant="outline"
      onClick={router.back}
      className="gap-1 text-sm"
    >
      <RxArrowLeft size={16} />
      Voltar
    </Button>
  )
}
