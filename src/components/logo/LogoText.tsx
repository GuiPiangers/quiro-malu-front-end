import Image from 'next/image'

type LogoTextProps = {
  className?: string
  color?: 'white' | 'default'
}

export function LogoText({ className, color }: LogoTextProps) {
  const logoEscrito = '/logo/Logo-escrito.svg'
  const logoEscritoWhite = '/logo/Logo-escrito-white.svg'

  // const srcLogo = () => {
  //   if (color === 'white') return logoEscritoWhite
  //   return logoEscrito
  // }

  const logoColor = color === 'white' ? 'text-white' : 'text-black'

  return (
    // <Image
    //   src={srcLogo()}
    //   alt="logo escrito da Quiro Malu"
    //   width={150}
    //   height={150}
    //   className={className}
    // ></Image>
    <div className={`text-center text-lg font-bold ${logoColor}`}>
      Quiro Malu
    </div>
  )
}
