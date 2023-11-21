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
        width={640}
        height={473}
        alt="Nenhum resultado encontrado"
      />
      {message}
      <a className="mt-4 text-xs text-blue-600" href="http://www.freepik.com">
        Designed by stories / Freepik
      </a>
    </div>
  )
}
