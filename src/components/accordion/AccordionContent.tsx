'use client'

import useIdContext from '@/hooks/useIdContext'
import useToggleGroupContext from '@/hooks/useToggleGroupContext'
import { ReactNode, HTMLAttributes } from 'react'

type AccordionContentProps = {
  children: ReactNode
  className?: string
} & HTMLAttributes<HTMLDivElement>

export default function AccordionContent({
  children,
  className,
  ...props
}: AccordionContentProps) {
  const { active } = useToggleGroupContext()
  const { id } = useIdContext()
  const contentId = `acc-content${id}`
  const headerId = `acc-header${id}`
  const isActive = active === contentId

  return (
    <div
      {...props}
      className="grid grid-rows-[0fr] transition-all duration-300 aria-[hidden=true]:collapse aria-[hidden=false]:grid-rows-[1fr]"
      role="region"
      aria-labelledby={headerId}
      id={contentId}
      aria-hidden={!isActive}
    >
      <div className={`overflow-hidden ${className}`}>{children}</div>
    </div>
  )
}
