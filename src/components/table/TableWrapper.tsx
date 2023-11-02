'use client'

import { ReactNode, useEffect } from 'react'
import AccordionDemo from '../Test'

type TableProps = {
  children: ReactNode
  columns: string[]
}

export default function TableWrapper({ children, columns }: TableProps) {
  const childrenValue = children?.valueOf() as any
  const childrenArray = childrenValue.children as Array<ReactNode>
  return (
    <div className="list-none">
      {childrenArray.map((child, index) => (
        <div
          key={index}
          className="grid w-full cursor-pointer items-center justify-items-start gap-2 border-b border-zinc-300 p-1 hover:bg-zinc-100"
        >
          {child}
        </div>
      ))}
      <AccordionDemo></AccordionDemo>
    </div>
  )
}
