import { Metadata } from 'next'

export const generateMetadata = (): Metadata => ({
  viewport: 'width=device-width, initial-scale=1, viewport-fit=cover',
})
export default function SchedulingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
