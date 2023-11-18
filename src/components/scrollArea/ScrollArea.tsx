import { ReactNode } from 'react'
import * as ScrollArea from '@radix-ui/react-scroll-area'

type ScrollAreaDemoProps = {
  children: ReactNode
}

const ScrollAreaDemo = ({ children }: ScrollAreaDemoProps) => (
  <ScrollArea.Root className="shadow-blackA4 h-[225px] w-[200px] overflow-hidden rounded bg-white shadow-[0_2px_10px]">
    <ScrollArea.Viewport className="h-full w-full rounded">
      {children}
    </ScrollArea.Viewport>
    <ScrollArea.Scrollbar
      className="bg-blackA3 hover:bg-blackA5 flex touch-none select-none p-0.5 transition-colors duration-[160ms] ease-out data-[orientation=horizontal]:h-2.5 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col"
      orientation="vertical"
    >
      <ScrollArea.Thumb className="bg-mauve10 relative flex-1 rounded-[10px] before:absolute before:left-1/2 before:top-1/2 before:h-full before:min-h-[44px] before:w-full before:min-w-[44px] before:-translate-x-1/2 before:-translate-y-1/2 before:content-['']" />
    </ScrollArea.Scrollbar>
    <ScrollArea.Scrollbar
      className="bg-blackA3 hover:bg-blackA5 flex touch-none select-none p-0.5 transition-colors duration-[160ms] ease-out data-[orientation=horizontal]:h-2.5 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col"
      orientation="horizontal"
    >
      <ScrollArea.Thumb className="bg-mauve10 relative flex-1 rounded-[10px] before:absolute before:left-1/2 before:top-1/2 before:h-full before:min-h-[44px] before:w-full before:min-w-[44px] before:-translate-x-1/2 before:-translate-y-1/2 before:content-['']" />
    </ScrollArea.Scrollbar>
    <ScrollArea.Corner className="bg-blackA5" />
  </ScrollArea.Root>
)

export default ScrollAreaDemo
