'use client'

import { HTMLAttributes } from 'react'
import { tableStyles } from './Style'

type TrowProps = HTMLAttributes<HTMLDivElement> & {
  columns: string[]
  clickable?: boolean
  handleOnClick?(): void
}

export default function Trow({
  children,
  className,
  columns,
  clickable = false,
  handleOnClick,
  ...props
}: TrowProps) {
  const { TrowStyle } = tableStyles()

  const renderChildren = () => {
    if (!clickable) return children
    return (
      <div
        role="button"
        className={TrowStyle({ className })}
        tabIndex={0}
        data-clickable={clickable}
        onClick={handleOnClick || undefined}
        style={{ gridTemplateColumns: columns.join(' ') }}
        onKeyDown={(e) => {
          if (handleOnClick)
            if (e.key === ' ' || e.key === 'Enter') handleOnClick()
        }}
      >
        {children}
      </div>
    )
  }

  return (
    <div
      role="row"
      data-clickable={clickable}
      className={clickable ? '' : TrowStyle({ className })}
      style={{ gridTemplateColumns: columns.join(' ') }}
      {...props}
    >
      {renderChildren()}
    </div>
  )
}
