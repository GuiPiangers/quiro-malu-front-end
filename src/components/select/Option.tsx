/* eslint-disable react/display-name */
import {
  Option as BaseOption,
  OptionProps,
  OptionOwnerState,
} from '@mui/base/Option'
import { forwardRef } from 'react'
import { tv } from 'tailwind-variants'

const getOptionColorClasses = ({
  selected,
  highlighted,
  disabled,
}: Partial<OptionOwnerState<number>>) => {
  let classes = ''
  if (disabled) {
    classes += ' text-slate-400'
  } else {
    if (selected) {
      classes += ' bg-purple-100 text-purple-950 '
    } else if (highlighted) {
      classes += ' bg-slate-100 text-slate-900 '
    }
    classes += ' hover:bg-slate-100  hover:text-slate-900'
  }
  return classes
}

const OptionStyle = tv({
  base: 'cursor-default list-none rounded-lg p-2 last-of-type:border-b-0',
  variants: {
    disabled: {
      true: 'text-slate-400',
      false: 'hover:bg-slate-100  hover:text-slate-900',
    },
    selected: {
      true: 'bg-purple-100 text-purple-950',
    },
    highlighted: {
      true: 'bg-slate-100 text-slate-900',
    },
  },
})

export const Option = forwardRef<HTMLLIElement, OptionProps<number>>(
  (props, ref) => {
    return (
      <BaseOption
        ref={ref}
        {...props}
        slotProps={{
          root: ({ selected, highlighted, disabled }) => ({
            // className: `list-none p-2 rounded-lg cursor-default last-of-type:border-b-0 ${getOptionColorClasses(
            //   { selected, highlighted, disabled },
            // )}`,
            className: OptionStyle({ selected, highlighted, disabled }),
          }),
        }}
      />
    )
  },
)
