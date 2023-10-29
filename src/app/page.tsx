import Input from '@/components/Input'
import UserProfile from '@/components/UserProfile'
import { UserService } from '@/services/user/UserService'
import { cookies } from 'next/headers'

export default async function Home() {
  const userService = new UserService()
  const cookieStore = cookies()
  const token = cookieStore.get('quiro-token')
  if (token?.value) {
    const UserResponse = await userService.get(token.value)
    console.log(UserResponse)
  }
  return (
    <main className="">
      <Input name="Nome"></Input>
      <p>{token?.value}</p>
      <UserProfile />
    </main>
  )
}
