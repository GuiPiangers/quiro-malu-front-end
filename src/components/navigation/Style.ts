import { VariantProps, tv } from 'tailwind-variants'

export const navStyles = tv({
  slots: {
    NavbarStyles: 'flex rounded-t-lg bg-white shadow-md shadow-slate-200',
    NavItemStyles:
      'block rounded-t-lg bg-white px-4 py-2 text-sm transition-colors hover:bg-slate-100',
  },
  variants: {
    active: {
      true: {
        NavItemStyles: 'font-semibold  ',
      },
    },
    variants: {
      underline: '',
      solid: '',
    },
  },
  compoundVariants: [
    {
      active: true,
      variants: 'underline',
      className: { NavItemStyles: 'border-b-2 border-main text-main' },
    },
    {
      active: true,
      variants: 'solid',
      className: { NavItemStyles: 'bg-main text-white hover:bg-main-hover' },
    },
  ],
  defaultVariants: { variants: 'solid' },
})

export type NavPropsVariants = VariantProps<typeof navStyles>
