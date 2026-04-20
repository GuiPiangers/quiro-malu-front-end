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
      <EditSendListForm strategy={res} />
    </div>
  )
}
