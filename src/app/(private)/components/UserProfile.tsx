import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { getUser, logoutUser } from '@/services/user/user'
import { Validate } from '@/services/api/Validate'
import Image from 'next/image'
import LogoutButton from '@/components/LogoutButton'

const imageProfile = '/profile/profile1.svg'

export default async function UserProfile() {
  const user = await getUser().then((res) =>
    Validate.isOk(res) ? res : undefined,
  )
  return (
    <div className="flex items-center gap-3">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Image
            alt="profile image"
            src={imageProfile}
            width={64}
            height={64}
            className="clip-circle h-8 w-8 cursor-pointer bg-white object-cover"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>{user?.name}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer hover:bg-slate-200">
            Perfil
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer hover:bg-slate-200">
            Configurações
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <LogoutButton asChild variant="ghost" className="rounded px-2 py-1.5">
            <DropdownMenuItem className="cursor-pointer justify-start text-red-600 hover:bg-red-100 focus:bg-red-100 focus:text-red-600">
              Sair
            </DropdownMenuItem>
          </LogoutButton>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
