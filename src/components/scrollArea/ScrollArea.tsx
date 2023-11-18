'use client'

import { ReactNode } from 'react'
import * as ScrollAreaBase from '@radix-ui/react-scroll-area'
import { twMerge } from 'tailwind-merge'

type ScrollAreaProps = {
  className?: string
  classBar?: string
  children: ReactNode
}

const ScrollArea = ({ children, className, classBar }: ScrollAreaProps) => (
  <ScrollAreaBase.Root
    className={twMerge('h-full w-full overflow-hidden', className)}
  >
    <ScrollAreaBase.Viewport className="h-full w-full">
      {children}
    </ScrollAreaBase.Viewport>
    <ScrollAreaBase.Scrollbar
      className={twMerge(
        'group flex touch-none select-none bg-slate-200 p-0.5 transition-colors duration-[160ms] ease-out hover:bg-slate-300 data-[orientation=horizontal]:h-2.5 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col',
        classBar,
      )}
      orientation="vertical"
    >
      <ScrollAreaBase.Thumb className="relative flex-1 rounded-[10px] bg-slate-400  transition-colors duration-[160ms] ease-out before:absolute before:left-1/2 before:top-1/2 before:h-full before:min-h-[44px] before:w-full before:min-w-[44px] before:-translate-x-1/2 before:-translate-y-1/2 before:content-[''] group-hover:bg-slate-500" />
    </ScrollAreaBase.Scrollbar>
    <ScrollAreaBase.Scrollbar
      className="group flex touch-none select-none bg-slate-200 p-0.5 transition-colors duration-[160ms] ease-out hover:bg-slate-300 data-[orientation=horizontal]:h-2.5 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col"
      orientation="horizontal"
    >
      <ScrollAreaBase.Thumb className="relative flex-1 rounded-[10px] bg-slate-400 before:absolute before:left-1/2 before:top-1/2 before:h-full before:min-h-[44px] before:w-full before:min-w-[44px] before:-translate-x-1/2 before:-translate-y-1/2 before:content-[''] group-hover:bg-slate-500" />
    </ScrollAreaBase.Scrollbar>
    <ScrollAreaBase.Corner className="bg-blackA5" />
  </ScrollAreaBase.Root>
)

export default ScrollArea
