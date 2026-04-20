import { notFound } from 'next/navigation'
import { Validate } from '@/services/api/Validate'
import { getMessageSendStrategy } from '@/services/message/sendList'
import EditSendListForm from './EditSendListForm'

type PageProps = {
  params: { id: string }
}

export default async function EditarListaEnvioPage({ params }: PageProps) {
  const res = await getMessageSendStrategy(params.id)
  if (Validate.isError(res)) {
    notFound()
  }

  return (
    <div className="w-full max-w-screen-lg space-y-6 text-slate-600">
      <div>
        <h2 className="text-lg font-semibold text-main">
          Editar lista de envio
        </h2>
        <p className="mt-2 text-sm">
          Altere o tipo, o nome e a quantidade da lista de envio.
        </p>
      </div>
      <EditSendListForm strategy={res} />
    </div>
  )
}
