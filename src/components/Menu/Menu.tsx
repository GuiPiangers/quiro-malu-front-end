'use client'

import * as React from 'react'
import clsx from 'clsx'
import { Menu as BaseMenu, MenuProps } from '@mui/base/Menu'
import {
  MenuButton as BaseMenuButton,
  MenuButtonProps,
} from '@mui/base/MenuButton'
import { MenuItem as BaseMenuItem, MenuItemProps } from '@mui/base/MenuItem'
import Button, { ButtonPropsVariants } from '../Button'

const resolveSlotProps = (fn: any, args: any) =>
  typeof fn === 'function' ? fn(args) : fn

export const Menu = React.forwardRef<HTMLDivElement, MenuProps>(
  function _Menu(props, ref) {
    return (
      <BaseMenu
        ref={ref}
        {...props}
        slotProps={{
          ...props.slotProps,
          root: (ownerState) => {
            const resolvedSlotProps = resolveSlotProps(
              props.slotProps?.root,
              ownerState,
            )
            return {
              ...resolvedSlotProps,
              className: clsx(` z-10`, resolvedSlotProps?.className),
            }
          },
          listbox: (ownerState) => {
            const resolvedSlotProps = resolveSlotProps(
              props.slotProps?.listbox,
              ownerState,
            )
            return {
              ...resolvedSlotProps,
              className: clsx(
                'text-sm box-border font-sans p-1.5 my-3 mx-0 rounded-xl overflow-auto outline-0 bg-white dark:bg-slate-900 border border-solid border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-300 min-w-listbox shadow-md dark:shadow-slate-900',
                resolvedSlotProps?.className,
              ),
            }
          },
        }}
      />
    )
  },
)

export const MenuButton = React.forwardRef<
  HTMLButtonElement,
  MenuButtonProps & ButtonPropsVariants
>(function _MenuButton(props, ref) {
  const { size, color, variant, className, ...other } = props
  return (
    <Button
      asChild
      size={size}
      color={color}
      variant={variant}
      className={className}
    >
      <BaseMenuButton ref={ref} {...other} />
    </Button>
  )
})

export const MenuItem = React.forwardRef<HTMLLIElement, MenuItemProps>(
  function _MenuItem(props, ref) {
    const { className, ...other } = props
    return (
      <BaseMenuItem
        ref={ref}
        className={clsx(
          'focus:shadow-outline-purple cursor-default select-none list-none rounded-lg p-2 last-of-type:border-b-0 focus:bg-slate-100 focus:text-slate-900 focus:outline-0 disabled:text-slate-400 disabled:hover:text-slate-400 focus:dark:bg-slate-800 focus:dark:text-slate-300 disabled:dark:text-slate-700 disabled:hover:dark:text-slate-700',
          className,
        )}
        {...other}
      />
    )
  },
)
