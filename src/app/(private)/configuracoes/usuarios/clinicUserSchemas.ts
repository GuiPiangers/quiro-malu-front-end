import { z } from 'zod'

const phoneBrPattern = /^\(\d{2}\) \d{5} \d{4}$/

const passwordSchema = z
  .string()
  .min(5, 'A senha precisa ter no mínimo 5 caracteres')
  .regex(/[A-Z]/, 'A senha deve conter pelo menos uma letra maiúscula')
  .regex(
    /[0-9!"#$%&'(.)*+,/:;<=>?@[\]^_`{|}~-]/,
    'A senha deve conter pelo menos um número ou carácter especial',
  )

export const clinicUserFormSchema = z
  .object({
    userKind: z.enum(['user', 'clinician'], {
      required_error: 'Selecione o tipo de usuário',
    }),
    name: z
      .string()
      .min(3, 'Mínimo de 3 caracteres')
      .max(120, 'Máximo de 120 caracteres'),
    email: z.string().email('Formato de e-mail inválido'),
    phone: z.string().regex(phoneBrPattern, {
      message: 'Formato inválido — use (DD) NNNNN NNNN',
    }),
    password: passwordSchema,
    roleId: z.string().min(1, 'Selecione uma função'),
    serviceIds: z.array(z.string()),
  })

export type ClinicUserFormData = z.infer<typeof clinicUserFormSchema>
