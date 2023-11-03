'use client'

import useIdContext from '@/hooks/useIdContext'
import { HTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'

type AccordionHeaderProps = HTMLAttributes<HTMLHeadingElement>

export default function AccordionHeader({
  children,
  className,
  ...props
}: AccordionHeaderProps) {
  const { id } = useIdContext()
  const headerId = `acc-header${id}`
  return (
    <h3
      id={headerId}
      {...props}
      className={twMerge('h-full w-full text-left', className)}
    >
      {children}
    </h3>
  )
}
