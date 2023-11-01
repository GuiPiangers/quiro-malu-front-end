import { tv } from 'tailwind-variants'

export const Style = tv({
  slots: {
    navItemStyle:
      'flex w-full items-center justify-start gap-4 rounded-md bg-white px-2 py-1.5 text-sm text-black transition hover:bg-zinc-200',
    SidebarStyle: 'z-10 h-full w-52 bg-white px-3 py-4 shadow',
    sideWrapperStyle:
      'fixed z-[5] hidden h-full w-full animate-[fadeIn_300ms] bg-black bg-opacity-20',
  },
  variants: {
    active: {
      true: {
        navItemStyle: 'bg-zinc-200 hover:bg-zinc-100',
      },
    },
    collapsed: {
      true: {
        navItemStyle: 'flex-col gap-0 px-1 py-2 text-[10px]',
        SidebarStyle: 'hidden w-fit px-1.5 sm:block',
      },
      false: {
        SidebarStyle:
          'fixed animate-[slideRight_300ms_ease-out] md:static md:animate-none',
        sideWrapperStyle: 'fixed block md:hidden ',
      },
    },
  },
  defaultVariants: {
    active: false,
    collapsed: true,
  },
})
