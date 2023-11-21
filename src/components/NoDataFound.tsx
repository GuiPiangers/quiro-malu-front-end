import Image from 'next/image'
import { ReactNode } from 'react'

type NoDataFoundProps = {
  message?: ReactNode
  className?: string
}

export default function NoDataFound({ message, className }: NoDataFoundProps) {
  const noDataFoundImage = '/no-data/noContent.svg'
  return (
    <div className="flex flex-col items-center justify-center">
      <Image
        className={className}
        src={noDataFoundImage}
        width={280}
        height={300}
        alt="Nenhum resultado encontrado"
      />
      {message}
    </div>
  )
}
