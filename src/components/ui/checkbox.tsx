'use client'

import * as React from 'react'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { Check } from 'lucide-react'
import { tv, VariantProps } from 'tailwind-variants'

import useIdContext from '@/hooks/useIdContext'

const checkboxStyle = tv({
  base: 'peer h-4 w-4 shrink-0 rounded-sm border ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  variants: {
    color: {
      primary:
        'border-main text-main ring-main data-[state=checked]:bg-main data-[state=checked]:text-white',
      blue: 'border-blue-500 text-blue-500 ring-blue-500 data-[state=checked]:bg-blue-500 data-[state=checked]:text-white',
      black:
        'border-slate-900 ring-slate-950 data-[state=checked]:bg-slate-900 data-[state=checked]:text-slate-50 dark:border-slate-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300 dark:data-[state=checked]:bg-slate-50 dark:data-[state=checked]:text-slate-900',
    },
  },
  defaultVariants: {
    color: 'black',
  },
})

export type CheckboxProps = React.ComponentPropsWithoutRef<
  typeof CheckboxPrimitive.Root
> &
  VariantProps<typeof checkboxStyle>

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, id, color, ...props }, ref) => {
  const { id: contextId } = useIdContext()
  const checkBoxId = id || contextId

  return (
    <CheckboxPrimitive.Root
      ref={ref}
      className={checkboxStyle({ color, className })}
      id={checkBoxId}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        className={'flex items-center justify-center text-current'}
      >
        <Check className="h-4 w-4" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
})
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
