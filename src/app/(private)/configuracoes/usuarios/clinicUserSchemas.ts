import { z } from 'zod'

const phoneBrPattern = /^\(\d{2}\) \d{5} \d{4}$/

export const clinicUserFormSchema = z.object({
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
  roleId: z.string().min(1, 'Selecione uma função'),
  serviceIds: z.array(z.string()),
})

export type ClinicUserFormData = z.infer<typeof clinicUserFormSchema>
