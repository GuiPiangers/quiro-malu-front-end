import { HTMLAttributes } from 'react'
import { inputStyles } from './Styles'
import { IdContextProvider } from '@/contexts/IdContext'

type InputRootProps = HTMLAttributes<HTMLDivElement>

export default function InputRoot({
  className,
  children,
  ...props
}: InputRootProps) {
  const { rootStyle } = inputStyles()
  return (
    <div className={rootStyle({ className })} {...props}>
      <IdContextProvider>{children}</IdContextProvider>
    </div>
  )
}
