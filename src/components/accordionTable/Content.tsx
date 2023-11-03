'use client'

import { ReactNode } from 'react'
import { tv } from 'tailwind-variants'
import { Accordion } from '../accordion'

const Style = tv({
  base: 'my-2 w-full rounded border px-4 py-2 shadow',
})

type ContentProps = {
  children: ReactNode
  className?: string
}

export default function Content({ children, className }: ContentProps) {
  return (
    <Accordion.Content className="col-span-full w-full">
      <div className={Style({ className })}>{children}</div>
    </Accordion.Content>
  )
}
