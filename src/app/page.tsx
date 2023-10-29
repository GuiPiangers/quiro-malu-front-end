import Input from '@/components/Input'
import UserProfile from '@/components/UserProfile'
import { getCookie } from '@/services/cookies/cookies'
import { userService } from '@/services/user/serverUserService'

export default async function Home() {
  const getProfile = async () => {
    return await userService.get()
  }

  const profile = await getProfile()

  return (
    <main className="">
      <Input name="Nome"></Input>
      <p>{profile ? profile.name : ''}</p>
      <UserProfile />
    </main>
  )
}
