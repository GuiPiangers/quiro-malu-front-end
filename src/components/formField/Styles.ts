import { tv } from 'tailwind-variants'

export const inputStyles = tv({
  slots: {
    rootStyle: 'flex w-full flex-col gap-1',
    labelStyle: 'text-sm font-medium',
    inputWrapperStyle:
      'box-border w-80 rounded-lg border border-solid border-slate-200 bg-white px-3 py-2 text-left font-sans text-sm text-slate-900 shadow-md shadow-slate-100 outline-0 transition-all hover:bg-slate-50',
    inputFieldStyle:
      'w-full select-none bg-transparent px-2 py-1 autofill:shadow-[0_0_0px_1000px_inset] autofill:shadow-white focus:outline-none',
    messageStyle: 'flex items-start gap-1 text-xs',
  },
  variants: {
    error: {
      true: {
        inputWrapperStyle: 'bg-red-50 outline outline-1 outline-red-600 ',
        inputFieldStyle:
          'text-red-600 placeholder:text-red-300 autofill:shadow-[0_0_0px_1000px_inset] autofill:shadow-red-50 autofill:focus:shadow-white',
        messageStyle: 'text-red-600',
      },
    },
    focus: {
      true: {
        inputWrapperStyle:
          'outline outline-1 outline-blue-500 ring-4 ring-blue-100',
      },
    },
    disabled: {
      true: {
        inputWrapperStyle: 'pointer-events-none bg-slate-100 text-slate-400 ',
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
