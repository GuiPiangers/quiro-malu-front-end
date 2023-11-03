'use client'

import { HTMLAttributes, ReactNode } from 'react'

type AccordionItemProps = {
  children: ReactNode
} & HTMLAttributes<HTMLDivElement>

export default function AccordionItem({
  children,
  ...props
}: AccordionItemProps) {
  return <div {...props}>{children}</div>
}
