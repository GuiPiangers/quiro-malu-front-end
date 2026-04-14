'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { RxArrowLeft } from 'react-icons/rx'

import Button from '@/components/Button'

type PreviousButtonProps = {
  href?: string | null
  previousLabel?: string | null
}

export default function PreviousButton({
  href,
  previousLabel,
}: PreviousButtonProps) {
  const router = useRouter()
  const text = previousLabel?.trim() || 'Voltar'
  const label = (
    <>
      <RxArrowLeft size={16} />
      {text}
    </>
  )

  if (href) {
    return (
      <Button variant="outline" size="small" className="gap-1 text-sm" asChild>
        <Link href={href}>{label}</Link>
      </Button>
    )
  }

  return (
    <Button
      size="small"
      variant="outline"
      onClick={() => router.back()}
      className="gap-1 text-sm"
    >
      {label}
    </Button>
  )
}
