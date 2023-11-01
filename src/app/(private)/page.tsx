import Input from '@/components/Input'
import { Logo } from '@/components/logo/'
import UserProfile from '@/components/UserProfile'
import { userService } from '@/services/user/serverUserService'

export default async function Home() {
  const profile = await userService.get()

  return (
    <main className="">
      <Input label="Nome"></Input>
      <p>{profile ? profile.name : ''}</p>
      <UserProfile />
      <Logo.Root>
        <Logo.Image className="h-14" />
        <Logo.Text className="h-8" />
      </Logo.Root>
    </main>
  )
}
