'use client'
import { RxArrowLeft } from 'react-icons/rx'

import Button from '@/components/Button'
import { useRouter } from 'next/navigation'

export default function PreviousButton() {
  const router = useRouter()
  return (
    <Button
      variant="outline"
      onClick={router.back}
      className="gap-1 px-4 py-1 text-sm"
    >
      <RxArrowLeft size={16} />
      Voltar
    </Button>
  )
}
