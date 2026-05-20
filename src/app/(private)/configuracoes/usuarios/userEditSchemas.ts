import { z } from 'zod'

export const userEditSchema = z.object({
  roleId: z.string().min(1, 'Selecione uma função'),
  serviceIds: z.array(z.string()),
})

export type UserEditFormData = z.infer<typeof userEditSchema>
