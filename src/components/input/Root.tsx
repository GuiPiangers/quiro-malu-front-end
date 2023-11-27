import { HTMLAttributes } from 'react'
import { IdContextProvider } from '@/contexts/IdContext'
import { twMerge } from 'tailwind-merge'

type InputRootProps = HTMLAttributes<HTMLDivElement>

export default function InputRoot({
  className,
  children,
  ...props
}: InputRootProps) {
  return (
    <div
      className={twMerge('flex w-full flex-col gap-1', className)}
      {...props}
    >
      <IdContextProvider>{children}</IdContextProvider>
    </div>
  )
}
