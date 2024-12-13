'use client'

import AuthForm from '../components/AuthForm'
import Link from 'next/link'
import PasswordInput from '../components/PasswordInput'
import Button from '@/components/Button'

import useAuthContext from '@/hooks/useAuthContext'
import { Input } from '@/components/input'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import Phone from '@/utils/Phone'
import useSnackbarContext from '@/hooks/useSnackbarContext'
import { registerUser } from '@/services/user/user'

const createUserSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'O nome deve conter no mínimo 3 caracteres' })
    .max(120, { message: 'O nome deve conter no máximo 120 caracteres' })
    .refine((value) => value.split(' ').length > 1, {
      message: 'Deve ser informado o nome completo (nome e sobrenome)',
    })
    .transform((name) => {
      return name
        .toLocaleLowerCase()
        .trim()
        .split(' ')
        .map((word) => {
          if (word.length <= 3 && word[word.length - 1] !== '.') return word
          return word[0].toLocaleUpperCase().concat(word.substring(1))
        })
        .join(' ')
    }),
  email: z.string().email({
    message: 'Formato de e-mail inválido',
  }),
  phone: z.string().regex(/^[(][0-9]{2}[)][ ][0-9]{5}[ ][0-9]{4}$/, {
    message: 'Formato de telefone inválido - padrão (DDD) 99999 9999',
  }),
  password: z
    .string()
    .min(5, {
      message: 'A senha precisa ter no mínimo 5 caracteres',
    })
    .refine((value) => value.match(/[A-Z]/), {
      message: 'A senha deve conter pelo menos uma letra maiúscula',
    })
    .refine((value) => value.match(/[0-9!"#$%&'(.)*+,/:;<=>?@[\]^_`{|}~-]/), {
      message: 'A senha deve conter pelo menos um número ou carácter especial',
    }),
})

export type CreateUserData = z.infer<typeof createUserSchema>

export default function Register() {
  const { singIn } = useAuthContext()
  const { handleMessage } = useSnackbarContext()

  const createUserForm = useForm<CreateUserData>({
    resolver: zodResolver(createUserSchema),
  })

  const {
    handleSubmit,
    formState: { isSubmitting, errors },
    register,
    setValue,
    setError,
  } = createUserForm

  const createUser = async (data: CreateUserData) => {
    const user = await registerUser(data)
    if (user.type) {
      setError(user.type as keyof CreateUserData, { message: user.message })
    } else {
      if (Object.hasOwn(user, 'email') && Object.hasOwn(user, 'password'))
        await singIn({ email: user.email, password: user.password })
      else {
        handleMessage({
          title: 'Erro!',
          description: user.message,
          type: 'error',
        })
      }
    }
  }

  return (
    <AuthForm title="Registrar" onSubmit={handleSubmit(createUser)}>
      <div className="flex flex-col gap-4">
        <Input.Root>
          <Input.Label>Nome</Input.Label>
          <Input.Field
            error={!!errors.name}
            {...register('name')}
            placeholder="João da Silva"
            disabled={isSubmitting}
            type="text"
          />
          {errors.name && (
            <Input.Message error>{errors.name.message}</Input.Message>
          )}
        </Input.Root>

        <Input.Root>
          <Input.Label>Telefone</Input.Label>
          <Input.Field
            error={!!errors.phone}
            {...register('phone')}
            placeholder="(51) 99999 9999"
            disabled={isSubmitting}
            type="tel"
            inputMode="tel"
            onChange={(e) => {
              setValue('phone', Phone.format(e.target.value))
            }}
          />
          {errors.phone && (
            <Input.Message error>{errors.phone.message}</Input.Message>
          )}
        </Input.Root>

        <Input.Root>
          <Input.Label>Email</Input.Label>
          <Input.Field
            error={!!errors.email}
            {...register('email')}
            placeholder="exemplo@gmail.com"
            type="email"
            disabled={isSubmitting}
          />
          {errors.email && (
            <Input.Message error>{errors.email.message}</Input.Message>
          )}
        </Input.Root>

        <PasswordInput
          {...register('password')}
          error={!!errors.password}
          disabled={isSubmitting}
        >
          {errors.password && (
            <Input.Message error>{errors.password.message}</Input.Message>
          )}
        </PasswordInput>

        <Button color="blue" disabled={isSubmitting}>
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
