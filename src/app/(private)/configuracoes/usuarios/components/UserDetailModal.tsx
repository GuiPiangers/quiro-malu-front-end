'use client'

import Modal, { ModalHandles } from '@/components/modal/Modal'
import HeaderForm from '@/components/modal/HeaderModal'
import { Table } from '@/components/table'
import { ClinicUserListItem, getClinicUser } from '@/services/clinicUsers/clinicUsers'
import { Validate } from '@/services/api/Validate'
import { useQuery } from '@tanstack/react-query'
import { useRef } from 'react'
import DeleteUserButton from './DeleteUserButton'
import { Time } from '@/utils/Time'

type UserDetailModalProps = {
  user: ClinicUserListItem
  roleName: string
  isClinician: boolean
}

export default function UserDetailModal({
  user,
  roleName,
  isClinician,
}: UserDetailModalProps) {
  const modalRef = useRef<ModalHandles>(null)

  const {
    data: detail,
    refetch,
    isFetching,
    isError,
  } = useQuery({
    queryKey: ['clinicUser', user.id],
    queryFn: async () => {
      const result = await getClinicUser(user.id)
      if (Validate.isError(result)) throw new Error(result.message)
      return result
    },
    enabled: false,
  })

  const openModal = async () => {
    await refetch()
    modalRef.current?.openModal()
  }

  const closeModal = () => modalRef.current?.closeModal()

  const displayKind =
    detail?.kind === 'clinician' || (!detail && isClinician)
      ? 'Clínico'
      : 'Usuário'

  return (
    <>
      <Table.Row
        clickable
        columns={['2fr', '2fr', '1.5fr', '1fr', '1fr']}
        onClick={openModal}
      >
        <Table.Cell className="font-medium">{user.name}</Table.Cell>
        <Table.Cell className="text-slate-600">{user.email}</Table.Cell>
        <Table.Cell className="text-slate-600">{user.phone}</Table.Cell>
        <Table.Cell>{roleName}</Table.Cell>
        <Table.Cell>
          <span
            className={
              isClinician
                ? 'rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700'
                : 'rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600'
            }
          >
            {isClinician ? 'Clínico' : 'Usuário'}
          </span>
        </Table.Cell>
      </Table.Row>

      <Modal ref={modalRef} className="m-4 w-full max-w-lg p-0">
        <HeaderForm handleClose={closeModal} title="Detalhes do usuário" />
        <div className="space-y-4 px-4 pb-4">
          {isFetching && !detail && (
            <p className="py-6 text-center text-sm text-slate-500">
              Carregando…
            </p>
          )}
          {isError && (
            <p className="py-6 text-center text-sm text-red-600">
              Não foi possível carregar os dados do usuário.
            </p>
          )}
          {detail && (
            <>
              <dl className="grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-xs font-semibold uppercase text-slate-500">
                    Nome
                  </dt>
                  <dd className="mt-0.5 font-medium text-slate-800">
                    {detail.name}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase text-slate-500">
                    Tipo
                  </dt>
                  <dd className="mt-0.5">{displayKind}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase text-slate-500">
                    E-mail
                  </dt>
                  <dd className="mt-0.5">{detail.email}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase text-slate-500">
                    Telefone
                  </dt>
                  <dd className="mt-0.5">{detail.phone}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-xs font-semibold uppercase text-slate-500">
                    Função
                  </dt>
                  <dd className="mt-0.5">{roleName}</dd>
                </div>
              </dl>

              {detail.kind === 'clinician' && (
                <div>
                  <h3 className="mb-2 text-sm font-semibold text-main">
                    Serviços vinculados
                  </h3>
                  {detail.services.length > 0 ? (
                    <ul className="space-y-2">
                      {detail.services.map((service) => (
                        <li
                          key={service.id}
                          className="rounded-md border border-slate-200 px-3 py-2 text-sm"
                        >
                          <span className="font-medium">{service.name}</span>
                          <span className="mt-0.5 block text-xs text-slate-500">
                            {Intl.NumberFormat('pt-BR', {
                              style: 'currency',
                              currency: 'BRL',
                            }).format(service.value)}{' '}
                            ·{' '}
                            {new Time(service.duration).getHoursAndMinutes()}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-slate-500">
                      Nenhum serviço vinculado.
                    </p>
                  )}
                </div>
              )}
            </>
          )}

          <div className="flex justify-end border-t border-slate-200 pt-4">
            <DeleteUserButton
              userId={user.id}
              userName={user.name}
              onDeleted={closeModal}
            />
          </div>
        </div>
      </Modal>
    </>
  )
}
