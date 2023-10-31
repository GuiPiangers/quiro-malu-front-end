'use client'

import Input from '@/components/Input'
import AuthForm from '../components/AuthForm'
import Link from 'next/link'
import PasswordInput from '../components/PasswordInput'
import Button from '@/components/Button'
import { ChangeEvent, useState } from 'react'

export default function Register() {
  const [fields, setFields] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
  })

  const handleChangeValue = (
    e: ChangeEvent<HTMLInputElement>,
    field: 'name' | 'phone' | 'email' | 'password',
  ) => {
    const value = e.target.value
    setFields((data) => ({ ...data, [field]: value }))
  }

  return (
    <AuthForm title="Registrar">
      <div className="flex flex-col gap-4">
        <Input
          name="name"
          label="Nome"
          placeholder="Seu nome"
          type="text"
          value={fields.name}
          onChange={(e) => handleChangeValue(e, 'name')}
        />
        <Input
          name="phone"
          label="Celular"
          placeholder="(51) 99999 9999"
          type="tel"
          value={fields.phone}
          onChange={(e) => handleChangeValue(e, 'phone')}
        />
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

        <Button
          color="edit"
          onClick={() => {
            return ''
          }}
        >
          Cadastrar
        </Button>

        <p className="text-sm text-center">
          Já possui uma conta?{' '}
          <Link className="text-blue-600 underline" href={'/login'}>
            Entrar
          </Link>
        </p>
      </div>
    </AuthForm>
  )
}
