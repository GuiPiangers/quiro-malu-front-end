'use client'
import { ReactNode } from 'react'

type AuthFormProps = {
  children: ReactNode
  title: string
}

export default function AuthForm({ children, title }: AuthFormProps) {
  return (
    <form
      className="w-96 bg-white rounded-lg shadow p-4 flex flex-col gap-6 "
      onSubmit={(e) => e.preventDefault()}
    >
      <h1 className="text-2xl font-bold text-center">{title}</h1>
      {children}
    </form>
  )
}
