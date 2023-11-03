'use client'

import useIdContext from '@/hooks/useIdContext'
import useToggleGroupContext from '@/hooks/useToggleGroupContext'
import { ReactNode, HTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'

type AccordionTriggerProps = {
  children: ReactNode
  className?: string
} & HTMLAttributes<HTMLDivElement>

export default function AccordionTrigger({
  children,
  className,
  ...props
}: AccordionTriggerProps) {
  const { setActive, active } = useToggleGroupContext()
  const { id } = useIdContext()
  const activeItemId = `acc-content${id}`
  const isActive = active === activeItemId
  return (
    <div
      role="button"
      tabIndex={0}
      {...props}
      className={twMerge('h-full w-full text-left', className)}
      aria-expanded={isActive}
      aria-controls={activeItemId}
      onClick={() => setActive(activeItemId)}
      onKeyDown={(e) => {
        console.log(e.key)
        if (e.key === ' ' || e.key === 'Enter') setActive(activeItemId)
      }}
    >
      {children}
    </div>
  )
}
