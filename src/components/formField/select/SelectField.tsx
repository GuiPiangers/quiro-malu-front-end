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
import { RxCaretDown } from 'react-icons/rx'
import useIdContext from '@/hooks/useIdContext'
import { inputStyles } from '../InputField'

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
      <RxCaretDown
        size={24}
        className="transition duration-300 group-aria-expanded:rotate-180"
      />
    </button>
  )
})

const resolveSlotProps = (fn: any, args: any) =>
  typeof fn === 'function' ? fn(args) : fn

export const SelectField = React.forwardRef(function CustomSelect<
  TValue extends {},
  Multiple extends boolean,
>(
  { error, ...props }: { error?: boolean } & SelectProps<TValue, Multiple>,
  ref: React.ForwardedRef<HTMLButtonElement>,
) {
  const { id } = useIdContext()
  const triggerRef = React.useRef<HTMLButtonElement>(null)
  const { inputWrapperStyle } = inputStyles({ disabled: props.disabled, error })
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
            ref: triggerRef,
            className: inputWrapperStyle({
              focus: ownerState.focusVisible,
              className: twMerge(
                'w-full p-1.5 relative px-3 py-2 [&>svg]:text-base	[&>svg]:absolute [&>svg]:h-full [&>svg]:top-0 [&>svg]:right-2.5',
                resolvedSlotProps?.className,
              ),
            }),

            id: id || props.id,
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
              `text-sm p-1.5 my-3 rounded-xl overflow-auto bg-white border text-slate-900 `,
              resolvedSlotProps?.className,
            ),
            style: { width: triggerRef.current?.offsetWidth },
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
