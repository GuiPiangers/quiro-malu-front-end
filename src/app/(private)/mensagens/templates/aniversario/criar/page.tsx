import { Cake } from 'lucide-react'
import BirthdayMessageForm from '../components/BirthdayMessageForm'

export default function CreateBirthdayCampaignPage() {
  return (
    <div className="w-full max-w-screen-lg space-y-6">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50">
            <Cake className="h-5 w-5 text-main" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-main">
              Mensagem de aniversário
            </h1>
            <p className="text-sm text-slate-500">Cadastrar nova campanha</p>
          </div>
        </div>
      </div>

      <BirthdayMessageForm />
    </div>
  )
}
