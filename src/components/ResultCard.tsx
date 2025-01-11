import { cn } from '@/lib/utils'
import { Currency } from '@/utils/Currency'
import { ReactNode } from 'react'

type ResultCardProps = {
  className?: string
  title: string
  value: number
  subText?: string | number | ReactNode
}

export default function ResultCard({
  className,
  title,
  value,
  subText,
}: ResultCardProps) {
  return (
    <div
      className={cn(
        'flex flex-col rounded-md bg-blue-500 p-4 text-white',
        className,
      )}
    >
      <span className="text-xs">{title}</span>
      <strong className="text-xl">{Currency.format(value)}</strong>
      <span className="mt-2 text-xs">{subText}</span>
    </div>
  )
}
