'use client'
import { FormHTMLAttributes, ReactNode } from 'react'

type AuthFormProps = {
  children: ReactNode
  title: string
} & FormHTMLAttributes<HTMLFormElement>

export default function AuthForm({ children, title, ...props }: AuthFormProps) {
  return (
    <form
      {...props}
      className="flex w-96 flex-col gap-6 rounded-lg bg-white p-4 shadow "
    >
      <h1 className="text-center text-2xl font-bold">{title}</h1>
      {children}
    </form>
  )
}
