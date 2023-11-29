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
import { inputStyles, inputVariantProps } from '../InputField'
import { tv } from 'tailwind-variants'

export const listBoxStyle = tv({
  base: 'my-3 max-h-60 overflow-auto rounded-xl border bg-white p-1.5 text-sm text-slate-900 ',
})

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
  {
    notSave,
    error,
    ...props
  }: SelectProps<TValue, Multiple> & inputVariantProps,
  ref: React.ForwardedRef<HTMLButtonElement>,
) {
  const { id } = useIdContext()
  const triggerRef = React.useRef<HTMLButtonElement>(null)
  const { inputWrapperStyle } = inputStyles({
    disabled: props.disabled,
    error,
    notSave,
  })
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
                'group w-full p-1.5 relative px-3 py-2 [&>svg]:text-base	[&>svg]:absolute [&>svg]:h-full [&>svg]:top-0 [&>svg]:right-2.5',
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
            className: listBoxStyle({
              className: resolvedSlotProps?.className,
            }),
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
