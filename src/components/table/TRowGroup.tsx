import { HTMLAttributes } from 'react'

type TRowGroupProps = HTMLAttributes<HTMLDivElement>

export default function TRowGroup({ children, ...props }: TRowGroupProps) {
  return (
    <div {...props} role="rowgroup">
      {children}
    </div>
  )
}
