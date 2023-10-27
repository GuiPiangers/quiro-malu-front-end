'use client'

import Input from '@/components/Input'
import AuthForm from '../components/AuthForm'
import Link from 'next/link'
import PasswordInput from '../components/PasswordInput'
import Button from '@/components/Button'
import { ChangeEvent, useState } from 'react'

async function loginUser(data: { email: string; password: string }) {
  try {
    const res = await fetch('http://localhost:8000/login', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    })
    console.log(await res.json())
    return res
  } catch (err) {
    console.log(err)
  }
}
export default function Login() {
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

  return (
    <AuthForm title="Login">
      <div className="flex flex-col gap-4">
        <Input
          name="Email"
          placeholder="exemplo@gmail.com"
          type="email"
          value={fields.email}
          onChange={(e) => handleChangeValue(e, 'email')}
        />
        <PasswordInput
          value={fields.password}
          onChange={(e) => handleChangeValue(e, 'password')}
        />

        <Button onClick={() => loginUser(fields)} color="edit">
          Entrar
        </Button>
        <p className="text-sm text-center">
          Ainda não possui uma conta?{' '}
          <Link className="text-blue-600 underline" href={'/register'}>
            Registre-se
          </Link>
        </p>
      </div>
    </AuthForm>
  )
}
