/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable react/display-name */
'use client'

import * as React from 'react'
import {
  Select as BaseSelect,
  SelectProps,
  SelectRootSlotProps,
} from '@mui/base/Select'
import { twMerge } from 'tailwind-merge'
import { Option } from './Option'

const Button = React.forwardRef(function Button<
  TValue extends {},
  Multiple extends boolean,
>(
  props: SelectRootSlotProps<TValue, Multiple>,
  ref: React.ForwardedRef<HTMLButtonElement>,
) {
  const { ownerState, ...other } = props
  return (
    <button type="button" {...other} ref={ref}>
      {other.children}
      {/* <UnfoldMoreRoundedIcon /> */}
    </button>
  )
})

export default function UnstyledSelectBasic() {
  return (
    <div className={''}>
      <Select defaultValue={10}>
        <Option value={10}>Ten</Option>
        <Option value={20}>Twenty</Option>
        <Option value={30}>Thirty</Option>
      </Select>
    </div>
  )
}

const resolveSlotProps = (fn: any, args: any) =>
  typeof fn === 'function' ? fn(args) : fn

const Select = React.forwardRef(function CustomSelect<
  TValue extends {},
  Multiple extends boolean,
>(
  props: SelectProps<TValue, Multiple>,
  ref: React.ForwardedRef<HTMLButtonElement>,
) {
  return (
    <BaseSelect
      ref={ref}
      {...props}
      slots={{
        root: Button,
      }}
      slotProps={{
        ...props.slotProps,
        root: (ownerState) => {
          const resolvedSlotProps = resolveSlotProps(
            props.slotProps?.root,
            ownerState,
          )
          return {
            ...resolvedSlotProps,
            className: twMerge(
              `text-sm box-border w-80 px-3 py-2 rounded-lg text-left bg-white border border-solid border-slate-200 text-slate-900 transition-all hover:bg-slate-50 outline-0 shadow-md shadow-slate-100 ${
                ownerState.focusVisible
                  ? 'focus-visible:ring-4 ring-purple-500/30 focus-visible:border-purple-500'
                  : ''
              } `,
              resolvedSlotProps?.className,
            ),
          }
        },
        listbox: (ownerState) => {
          const resolvedSlotProps = resolveSlotProps(
            props.slotProps?.listbox,
            ownerState,
          )
          return {
            ...resolvedSlotProps,
            className: twMerge(
              `text-sm p-1.5 my-3 w-80 rounded-xl overflow-auto outline-0 bg-white border text-slate-900 `,
              resolvedSlotProps?.className,
            ),
          }
        },
        popper: (ownerState) => {
          const resolvedSlotProps = resolveSlotProps(
            props.slotProps?.popper,
            ownerState,
          )
          return {
            ...resolvedSlotProps,
            className: twMerge(resolvedSlotProps?.className),
          }
        },
      }}
    />
  )
})
