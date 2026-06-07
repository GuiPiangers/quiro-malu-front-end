import PageNotFound from '@/components/notFound/PageNotFound'

export default function NotFound() {
  return (
    <PageNotFound
      variant="full"
      showLogo
      homeHref="/"
      homeLabel="Ir para o início"
    />
  )
}
