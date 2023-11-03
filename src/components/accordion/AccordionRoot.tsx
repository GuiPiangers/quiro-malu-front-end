'use client'

import { ToggleGroupContextProvider } from '@/contexts/ToggleGroupContext'
import { HTMLAttributes, ReactNode } from 'react'

type AccordionRootProps = {
  children: ReactNode
} & HTMLAttributes<HTMLDivElement>

export default function AccordionRoot({
  children,
  ...props
}: AccordionRootProps) {
  return (
    <div {...props}>
      <ToggleGroupContextProvider>{children}</ToggleGroupContextProvider>
    </div>
  )
}
