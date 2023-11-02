'use client'

import { ReactNode } from 'react'
<<<<<<< HEAD

=======
>>>>>>> parent of c896be1 (fixing table components)
import * as Accordion from '@radix-ui/react-accordion'
import { tv } from 'tailwind-variants'

const Style = tv({
  base: 'my-2 w-full rounded border px-4 py-2 shadow',
})

type ContentProps = {
  children: ReactNode
  className?: string
}

<<<<<<< HEAD
export const Content = function ({ children, className }: ContentProps) {
=======
export default function Content({ children, className }: ContentProps) {
>>>>>>> parent of c896be1 (fixing table components)
  return (
    <Accordion.Content className="AccordionContent col-span-full w-full">
      <div className={Style({ className })}>{children}</div>
    </Accordion.Content>
  )
}
