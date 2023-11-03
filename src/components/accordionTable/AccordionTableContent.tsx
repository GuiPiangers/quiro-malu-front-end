import { ReactNode } from 'react'
import { Accordion } from '../accordion'
import { twMerge } from 'tailwind-merge'

type ContentProps = {
  children: ReactNode
  className?: string
}

export default function AccordionTableContent({
  children,
  className,
}: ContentProps) {
  return (
    <Accordion.Content className="col-span-full w-full">
      <div
        className={twMerge(
          'my-2 w-full rounded border px-4 py-2 shadow',
          className,
        )}
      >
        {children}
      </div>
    </Accordion.Content>
  )
}
