'use client'

import { Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import AuthForm from '../components/AuthForm'
import PasswordInput from '../components/PasswordInput'
import Button from '@/components/Button'
import { Input } from '@/components/input'
import useSnackbarContext from '@/hooks/useSnackbarContext'
import { resetPassword } from '@/services/authentication/authentication'
import { Validate } from '@/services/api/Validate'

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(5, { message: 'A senha precisa ter no mínimo 5 caracteres' })
      .refine((value) => value.match(/[A-Z]/), {
        message: 'A senha deve conter pelo menos uma letra maiúscula',
      })
      .refine((value) => value.match(/[0-9!"#$%&'(.)*+,/:;<=>?@[\]^_`{|}~-]/), {
        message:
          'A senha deve conter pelo menos um número ou carácter especial',
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'As senhas não coincidem',
  })

type ResetPasswordData = z.infer<typeof resetPasswordSchema>

function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token') ?? ''
  const { handleMessage } = useSnackbarContext()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordData>({
    resolver: zodResolver(resetPasswordSchema),
  })

  const handleResetPassword = async (data: ResetPasswordData) => {
    const res = await resetPassword({ token, password: data.password })

    if (Validate.isError(res)) {
      handleMessage({ title: 'Erro!', description: res.message, type: 'error' })
      return
    }

    handleMessage({
      title: 'Senha redefinida!',
      description: 'Sua senha foi alterada com sucesso.',
      type: 'success',
    })
    router.push('/login')
  }

  return (
    <AuthForm
      title="Redefinir senha"
      onSubmit={handleSubmit(handleResetPassword)}
    >
      <div className="flex flex-col gap-4">
        <PasswordInput
          {...register('password')}
          error={!!errors.password}
          disabled={isSubmitting}
        >
          {errors.password && (
            <Input.Message error>{errors.password.message}</Input.Message>
          )}
        </PasswordInput>

        <Input.Root>
          <Input.Label>Confirmar senha</Input.Label>
          <Input.Field
            {...register('confirmPassword')}
            error={!!errors.confirmPassword}
            placeholder="Repita a senha"
            type="password"
            disabled={isSubmitting}
            autoComplete="off"
          />
          {errors.confirmPassword && (
            <Input.Message error>
              {errors.confirmPassword.message}
            </Input.Message>
          )}
        </Input.Root>

        <Button color="blue" disabled={isSubmitting || !token}>
          Redefinir senha
        </Button>
      </div>
    </AuthForm>
  )
}

export default function RedefinirSenha() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  )
}
