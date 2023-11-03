'use client'

import Input from '@/components/Input'
import AuthForm from '../components/AuthForm'
import Link from 'next/link'
import PasswordInput from '../components/PasswordInput'
import Button from '@/components/Button'
import { ChangeEvent, useState, useContext } from 'react'
import useAuthContext from '@/hooks/useAuthContext'

export default function Login() {
  const { singIn, user } = useAuthContext()
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
    await singIn(fields)
  }

  return (
    <AuthForm title="Login">
      <div className="flex flex-col gap-4 ">
        <Input
          name="email"
          label="Email"
          placeholder="exemplo@gmail.com"
          type="email"
          value={fields.email}
          onChange={(e) => handleChangeValue(e, 'email')}
        />
        <PasswordInput
          value={fields.password}
          onChange={(e) => handleChangeValue(e, 'password')}
        />

        <Button color="blue" onClick={handleSignIn}>
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
