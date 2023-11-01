import Image from 'next/image'

type LogoImageProps = {
  className?: string
  color?: 'white' | 'default'
}

export function LogoImage({ className, color }: LogoImageProps) {
  const logo = '/logo/Logo.svg'
  const logoWhite = '/logo/Logo-white.svg'

  const srcLogo = () => {
    if (color === 'white') return logoWhite
    return logo
  }

  return (
    <Image
      src={srcLogo()}
      alt="logo da Quiro Malu"
      width={40}
      height={40}
      className={className}
    />
  )
}
