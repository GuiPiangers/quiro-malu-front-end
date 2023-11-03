import { HTMLAttributes } from 'react'

type TCellProps = HTMLAttributes<HTMLDivElement>

export default function TCell({ children, ...props }: TCellProps) {
  return (
    <div {...props} role="cell">
      {children}
    </div>
  )
}
