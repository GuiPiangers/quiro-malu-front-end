import { tv } from 'tailwind-variants'

export const inputStyles = tv({
  slots: {
    rootStyle: 'flex flex-col gap-1',
    labelStyle: 'text-sm font-medium',
    inputWrapperStyle:
      'flex gap-2 rounded border bg-white px-2 py-1 text-sm focus-within:outline focus-within:outline-1 focus-within:outline-blue-500 focus-within:ring-4 focus-within:ring-blue-50',
    inputFieldStyle: 'w-full select-none bg-transparent focus:outline-none',
    messageStyle: 'flex items-start gap-1 text-xs',
  },
  variants: {
    error: {
      true: {
        inputWrapperStyle:
          'bg-red-50 text-red-600 outline outline-1 outline-red-600 focus-within:bg-white focus-within:text-black focus-within:ring-red-50',
        inputFieldStyle: 'placeholder:text-red-300',
        messageStyle: 'text-red-600',
      },
    },
    disabled: {
      true: {
        inputWrapperStyle: 'pointer-events-none bg-zinc-100 text-zinc-400 ',
      },
    },
  },
  defaultVariants: {
    error: false,
  },
})
