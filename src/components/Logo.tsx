import Image from "next/image";

export function Logo(){
    const logo = '/logo/Logo.svg'
    const logoEscrito = '/logo/Logo - escrito.svg'
    return(
        <div className="flex">
            <Image src={logo} alt="logo da Quiro Malu" width={40} height={40}></Image>
            <Image src={logoEscrito} alt="logo da Quiro Malu" width={150} height={150}></Image>
        </div>
    )
}