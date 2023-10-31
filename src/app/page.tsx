import Input from '@/components/Input'
import UserProfile from '@/components/UserProfile'
import { userService } from '@/services/user/serverUserService'
import { NextResponse } from 'next/server'
import { setCookie } from 'nookies'

export default async function Home() {
  const profile = await userService.get()

  return (
    <main className="">
      <Input label="Nome"></Input>
      <p>{profile ? profile.name : ''}</p>
      <UserProfile />
    </main>
  )
}
