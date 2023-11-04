'use client'

import AuthForm from '../components/AuthForm'
import Link from 'next/link'
import PasswordInput from '../components/PasswordInput'
import Button from '@/components/Button'
import { ChangeEvent, useState } from 'react'
import useAuthContext from '@/hooks/useAuthContext'
import { clientUserService } from '@/services/user/clientUserService'
import { Input } from '@/components/input'

export default function Register() {
  const { singIn } = useAuthContext()
  const [isLoading, setIsLoading] = useState(false)

  const [fields, setFields] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
  })

  const handleOnSubmit = async () => {
    setIsLoading(true)
    const user = await clientUserService.register(fields)
    console.log(user)
    if (
      typeof user === 'object' &&
      Object.hasOwn(user, 'email') &&
      Object.hasOwn(user, 'password')
    )
      await singIn({ email: user.email, password: user.password })
    setIsLoading(false)
  }

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
        <Input.Root>
          <Input.Label>Email</Input.Label>
          <Input.Field
            placeholder="João da Silva"
            type="text"
            value={fields.email}
            disabled={isLoading}
            onChange={(e) => handleChangeValue(e, 'name')}
          />
        </Input.Root>
        <Input.Root>
          <Input.Label>Telefone</Input.Label>
          <Input.Field
            placeholder="(51) 99999 9999"
            disabled={isLoading}
            type="tel"
            value={fields.phone}
            onChange={(e) => handleChangeValue(e, 'phone')}
          />
        </Input.Root>
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
          disabled={isLoading}
          value={fields.password}
          onChange={(e) => handleChangeValue(e, 'password')}
        />

        <Button color="blue" disabled={isLoading} onClick={handleOnSubmit}>
          Cadastrar
        </Button>

        <p className="text-center text-sm">
          Já possui uma conta?{' '}
          <Link className="text-blue-600 underline" href={'/login'}>
            Entrar
          </Link>
        </p>
      </div>
    </AuthForm>
  )
}
