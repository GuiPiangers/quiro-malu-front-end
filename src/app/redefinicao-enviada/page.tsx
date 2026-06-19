import Button from '@/components/Button'
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Conta criada | Quiro Malu',
  description:
    'Sua conta foi criada com sucesso. Verifique seu e-mail para definir sua senha.',
}

export default function RedefinicaoEnviada() {
  return (
    <main className="flex min-h-[100svh] w-full flex-col items-center justify-center bg-slate-50 px-4">
      <div className="flex w-full max-w-md flex-col items-center gap-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
        {/* Ícone de e-mail */}
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-50">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-blue-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25H4.5a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5H4.5a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
            />
          </svg>
        </div>

        {/* Textos */}
        <div className="flex flex-col items-center gap-3 text-center">
          <h1 className="text-2xl font-semibold text-slate-800">
            Redefinição de senha solicitada!
          </h1>
          <p className="text-sm leading-relaxed text-slate-500">
            Enviamos um link para o seu e-mail. Acesse-o para redefinir sua
            senha
          </p>
          <p className="text-xs text-slate-400">
            Não recebeu o e-mail? Verifique sua caixa de spam ou lixo
            eletrônico.
          </p>
        </div>

        <Button asChild color="blue" variant="outline">
          <Link href="/redefinir-senha/solicitar">Solicitar novamente</Link>
        </Button>
      </div>
    </main>
  )
}
