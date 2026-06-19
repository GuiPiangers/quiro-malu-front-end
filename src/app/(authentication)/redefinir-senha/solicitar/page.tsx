'use client'

import AuthForm from '../../components/AuthForm'
import Link from 'next/link'
import Button from '@/components/Button'

import { Input } from '@/components/input'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import useSnackbarContext from '@/hooks/useSnackbarContext'
import { sendResetPasswordToken } from '@/services/authentication/authentication'
import { useRouter } from 'next/navigation'

const requestResetSchema = z.object({
  email: z.string().email({
    message: 'Formato de e-mail inválido',
  }),
})

export type RequestResetData = z.infer<typeof requestResetSchema>

export default function SolicitarRedefinicao() {
  const { handleMessage } = useSnackbarContext()
  const router = useRouter()

  const requestResetForm = useForm<RequestResetData>({
    resolver: zodResolver(requestResetSchema),
  })

  const {
    handleSubmit,
    formState: { isSubmitting, errors },
    register,
    setError,
  } = requestResetForm

  const requestReset = async (data: RequestResetData) => {
    const response = await sendResetPasswordToken(data)

    if (response) {
      setError('email', { message: response.message })
      handleMessage({
        title: 'Erro!',
        description: 'Erro ao solicitar redefinição de senha',
        type: 'error',
      })
    } else {
      router.push('/redefinicao-enviada')
    }
  }

  return (
    <AuthForm title="Recuperar senha" onSubmit={handleSubmit(requestReset)}>
      <div className="flex flex-col gap-4">
        <p className="text-sm text-slate-500">
          Informe seu e-mail cadastrado e enviaremos um link para você redefinir
          sua senha.
        </p>
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

        <Button color="blue" disabled={isSubmitting}>
          Enviar link de recuperação
        </Button>

        <p className="text-center text-sm">
          Lembrou sua senha?{' '}
          <Link className="text-blue-600 underline" href={'/login'}>
            Entrar
          </Link>
        </p>
      </div>
    </AuthForm>
  )
}
