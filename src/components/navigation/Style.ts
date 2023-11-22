import { tv } from 'tailwind-variants'

export const navStyles = tv({
  slots: {
    NavbarStyles: 'flex rounded-t-lg bg-white shadow-md shadow-slate-200',
    NavItemStyles:
      'block rounded-t-lg bg-white px-4 py-2 text-sm transition-colors hover:bg-slate-100',
  },
  variants: {
    active: {
      true: {
        NavItemStyles: 'bg-main font-semibold text-white hover:bg-main-hover',
      },
    },
  },
})
