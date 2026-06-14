'use client'

import Button from '@/components/Button'
import { Validate } from '@/services/api/Validate'
import { responseError } from '@/services/api/api'
import { createClinician, createStandardClinicUser } from '@/services/user/user'
import { Role } from '@/services/rbac/rbac'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import ClinicUserForm from './ClinicUserForm'
import { ClinicUserFormData } from '../clinicUserSchemas'

type CreateClinicUserProps = {
  defaultRoles: Role[]
}

export default function CreateClinicUser({
  defaultRoles,
}: CreateClinicUserProps) {
  const router = useRouter()
  const queryClient = useQueryClient()

  const afterValidation = () => {
    queryClient.invalidateQueries({ queryKey: ['clinicUsers'] })
    queryClient.invalidateQueries({ queryKey: ['clinicians'] })
    router.push('/configuracoes/usuarios')
  }

  const handleCreate = async (
    data: ClinicUserFormData,
  ): Promise<responseError | void> => {
    const payload = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      password: data.password,
      roleId: data.roleId,
    }

    if (data.userKind === 'clinician') {
      const res = await createClinician({
        ...payload,
        services: data.serviceIds.map((serviceId) => ({ serviceId })),
      })
      if (Validate.isError(res)) return res
      return undefined
    }

    const res = await createStandardClinicUser(payload)
    if (Validate.isError(res)) return res
    return undefined
  }

  return (
    <div className="flex w-full max-w-screen-lg flex-col gap-4">
      <ClinicUserForm
        defaultRoles={defaultRoles}
        className="border-none shadow-none"
        btWrapperClassName="justify-start"
        buttons={
          <>
            <Button color="green" type="submit">
              Salvar
            </Button>
            <Button
              type="button"
              variant="outline"
              color="black"
              onClick={() => router.push('/configuracoes/usuarios')}
            >
              Cancelar
            </Button>
          </>
        }
        action={handleCreate}
        afterValidation={afterValidation}
      />
    </div>
  )
}
