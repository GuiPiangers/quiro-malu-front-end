/* eslint-disable react/display-name */
'use client'

import * as React from 'react'
import {
  Input as BaseInput,
  InputProps,
  MultiLineInputProps,
} from '@mui/base/Input'
import { twMerge } from 'tailwind-merge'

import { tv } from 'tailwind-variants'
import useIdContext from '@/hooks/useIdContext'
import { TextareaAutosize } from '@mui/base'

export const inputStyles = tv({
  slots: {
    inputWrapperStyle:
      'flex items-center rounded-lg bg-white text-sm font-normal leading-5 text-slate-900 shadow-md shadow-slate-100 outline outline-1  outline-slate-300 hover:bg-slate-50 hover:outline hover:outline-1  ',
    inputFieldStyle:
      'flex-grow rounded-md border-none px-3 py-2 outline-none after:block after:text-black ',
  },
  variants: {
    error: {
      true: {
        inputWrapperStyle:
          'bg-red-50 outline outline-1 outline-red-600 hover:bg-white',
        inputFieldStyle:
          'text-red-600 placeholder:text-red-300 autofill:shadow-[0_0_0px_1000px_inset] autofill:shadow-red-50 autofill:focus:shadow-white',
      },
    },
    focus: {
      true: {
        inputWrapperStyle: 'outline-purple-500 ring-4 ring-purple-100',
      },
    },
    disabled: {
      true: {
        inputWrapperStyle: 'pointer-events-none bg-slate-100 text-slate-400 ',
        inputFieldStyle: 'placeholder-transparent',
      },
    },
  },
  compoundVariants: [
    {
      focus: true,
      error: true,
      className: {
        inputWrapperStyle:
          'bg-white text-slate-900 outline-red-600 ring-red-50 ',
      },
    },
  ],
  defaultVariants: {
    error: false,
  },
})

const resolveSlotProps = (fn: any, args: any) =>
  typeof fn === 'function' ? fn(args) : fn

const TextArea = React.forwardRef(function TextArea<TValue extends object>(
  props: React.HTMLAttributes<HTMLTextAreaElement> & MultiLineInputProps,
  ref: React.ForwardedRef<HTMLTextAreaElement>,
) {
  const { ownerState, ...other } = props as any
  return <TextareaAutosize {...other} ref={ref}></TextareaAutosize>
})

export const InputField = React.forwardRef<HTMLInputElement, InputProps>(
  (props, ref) => {
    const { inputFieldStyle, inputWrapperStyle } = inputStyles({
      disabled: props.disabled,
      error: props.error,
    })
    const { id } = useIdContext()

    return (
      <BaseInput
        ref={ref}
        {...props}
        className={twMerge(props.className)}
        slots={{ root: 'div', textarea: TextArea }}
        slotProps={{
          ...props.slotProps,
          root: (ownerState) => {
            const resolvedSlotProps = resolveSlotProps(
              props.slotProps?.input,
              ownerState,
            )
            return {
              ...resolvedSlotProps,
              className: inputWrapperStyle({
                className: resolvedSlotProps?.className,
                focus: ownerState.focused,
              }),
            }
          },
          input: (ownerState) => {
            const resolvedSlotProps = resolveSlotProps(
              props.slotProps?.input,
              ownerState,
            )
            return {
              ...resolvedSlotProps,
              className: inputFieldStyle({
                className: resolvedSlotProps?.className,
              }),
              id: props.id || id,
            }
          },
        }}
      />
    )
  },
)
