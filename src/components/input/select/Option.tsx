/* eslint-disable react/display-name */
'use client'

import { Option as BaseOption, OptionProps } from '@mui/base/Option'
import { forwardRef } from 'react'
import { tv } from 'tailwind-variants'

export const OptionStyle = tv({
  base: 'cursor-default list-none rounded-lg p-2',
  variants: {
    disabled: {
      true: 'text-slate-400',
      false: 'hover:bg-slate-100  hover:text-slate-900',
    },
    highlighted: {
      true: 'border border-purple-500 bg-slate-100 text-slate-900',
    },
    selected: {
      true: 'bg-purple-100 text-purple-950 hover:bg-purple-200',
    },
  },
  defaultVariants: {
    disabled: false,
    highlighted: false,
    selected: false,
  },
})

export const Option = forwardRef<HTMLLIElement, OptionProps<number | string>>(
  (props, ref) => {
    return (
      <BaseOption
        ref={ref}
        {...props}
        slotProps={{
          root: ({ selected, highlighted, disabled }) => ({
            className: OptionStyle({ selected, highlighted, disabled }),
          }),
        }}
      />
    )
  },
)
