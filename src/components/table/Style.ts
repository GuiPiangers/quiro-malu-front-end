import { tv } from 'tailwind-variants'

export const tableStyles = tv({
  slots: {
    TrowStyle:
      'grid w-full items-center justify-items-start border-b bg-white px-2 py-1.5 data-[clickable=true]:hover:bg-slate-100',
    THeadStyle: 'font-bold text-main',
  },
})
