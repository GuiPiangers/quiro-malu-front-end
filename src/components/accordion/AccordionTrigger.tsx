'use client'

import useIdContext from '@/hooks/useIdContext'
import useToggleGroupContext from '@/hooks/useToggleGroupContext'
import { ReactNode, HTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'
import AccordionHeader from './AccordionHeader'

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
  const triggerId = `acc-trigger${id}`
  const isActive = active === activeItemId
  return (
    <AccordionHeader>
      <div
        role="button"
        tabIndex={0}
        {...props}
        id={triggerId}
        className={twMerge('group h-full w-full text-left', className)}
        aria-expanded={isActive}
        aria-controls={activeItemId}
        onClick={() => {
          setActive(activeItemId)
        }}
        onKeyDown={(e) => {
          if (e.key === ' ' || e.key === 'Enter') setActive(activeItemId)
        }}
      >
        {children}
      </div>
    </AccordionHeader>
  )
}
