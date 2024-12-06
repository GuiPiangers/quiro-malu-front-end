'use client'

import { ReactNode } from 'react'

type StopPropagation = { children: ReactNode }

export default function StopPropagation({ children }: StopPropagation) {
  return <div onClick={(e) => e.stopPropagation()}>{children}</div>
}
