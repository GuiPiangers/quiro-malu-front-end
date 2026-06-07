import Image from 'next/image'
import Link from 'next/link'
import Button from '@/components/Button'

type PageNotFoundProps = {
  title?: string
  description?: string
  homeHref?: string
  homeLabel?: string
  className?: string
  variant?: 'full' | 'embedded'
  showLogo?: boolean
}

export default function PageNotFound({
  title = 'Página não encontrada',
  description = 'Não encontramos a página que você procura. Volte à página anterior ou retorne ao início do sistema.',
  homeHref = '/',
  homeLabel = 'Ir para o início',
  className,
  variant = 'embedded',
  showLogo = true,
}: PageNotFoundProps) {
  const isFull = variant === 'full'

  return (
    <div
      className={`flex w-full items-center justify-center bg-white ${
        isFull
          ? 'min-h-screen'
          : 'min-h-[55vh] rounded-xl border border-slate-200'
      } ${className ?? ''}`}
    >
      <div className="flex w-full max-w-lg flex-col items-center px-6 py-12 text-center sm:px-10">
        {showLogo && (
          <Image
            src="/logo/Logo.svg"
            alt="Quiro Malu"
            width={72}
            height={20}
            priority
            className="mb-5 h-auto w-[72px]"
          />
        )}

        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          {title}
        </h1>

        <p className="mt-4 text-base leading-relaxed text-slate-600">
          {description}
        </p>

        <div className="mt-6">
          <Button
            asChild
            color="primary"
            variant="outline"
            className="min-w-[200px] border-main text-main hover:bg-main hover:text-white"
          >
            <Link href={homeHref}>{homeLabel}</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
