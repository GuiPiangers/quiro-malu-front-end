import Input from '@/components/Input'
import UserProfile from '@/components/UserProfile'
import { userService } from '@/services/user/serverUserService'

export default async function Home() {
  const profile = await userService.get()

  return (
    <main className="">
      <Input name="Nome"></Input>
      <p>{profile ? profile.name : ''}</p>
      <UserProfile />
    </main>
  )
}
