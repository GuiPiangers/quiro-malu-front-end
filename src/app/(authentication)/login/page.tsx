'use client'

import AuthForm from '../components/AuthForm'
import Link from 'next/link'
import PasswordInput from '../components/PasswordInput'
import Button from '@/components/Button'
import { ChangeEvent, useState, useContext } from 'react'
import useAuthContext from '@/hooks/useAuthContext'
import { Input } from '@/components/input'

export default function Login() {
  const { singIn, user } = useAuthContext()
  const [isLoading, setIsLoading] = useState(false)
  const [fields, setFields] = useState({
    email: '',
    password: '',
  })

  const handleChangeValue = (
    e: ChangeEvent<HTMLInputElement>,
    field: 'email' | 'password',
  ) => {
    const value = e.target.value
    setFields((data) => ({ ...data, [field]: value }))
  }

  const handleSignIn = async () => {
    setIsLoading(true)
    await singIn(fields)
    setIsLoading(false)
  }

  return (
    <AuthForm title="Login">
      <div className="flex flex-col gap-4 ">
        <Input.Root>
          <Input.Label>Email</Input.Label>
          <Input.Field
            placeholder="exemplo@gmail.com"
            type="email"
            value={fields.email}
            disabled={isLoading}
            onChange={(e) => handleChangeValue(e, 'email')}
          />
        </Input.Root>

        <PasswordInput
          value={fields.password}
          onChange={(e) => handleChangeValue(e, 'password')}
          disabled={isLoading}
        />

        <Button color="blue" onClick={handleSignIn} disabled={isLoading}>
          Entrar
        </Button>
        <p>{user?.name}</p>
        <p className="text-center text-sm">
          Ainda não possui uma conta?{' '}
          <Link className="text-blue-600 underline" href={'/register'}>
            Registre-se
          </Link>
        </p>
      </div>
    </AuthForm>
  )
}
