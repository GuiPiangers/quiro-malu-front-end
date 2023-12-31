'use client'

import { ReactNode, createContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

import { UserResponse } from '@/services/user/UserService'
import { clientUserService } from '@/services/user/clientUserService'
import { clientCookie } from '@/services/cookies/clientCookies'
import { responseError } from '@/services/api/api'
import { Validate } from '@/services/api/Validate'

export type SignInData = {
  email: string | null
  password: string | null
}
type AuthContextType = {
  singIn(data: SignInData): Promise<(UserResponse | responseError) | undefined>
  singOut(): Promise<void>
  user: UserResponse['user'] | null
}

export const AuthContext = createContext({} as AuthContextType)

export function AuthContextProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserResponse['user'] | null>(null)

  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const userResponse = await clientUserService.get()
      if (Validate.isOk(userResponse)) {
        const { name, email } = userResponse
        setUser({ name, email })
      }
    }
    getUser()
  }, [])

  async function singIn(data: SignInData) {
    const userResponse = await clientUserService.login(data)
    if (userResponse) {
      if (Validate.isOk(userResponse)) {
        const { refreshToken, token, user: userData } = userResponse

        if (token && refreshToken) {
          clientCookie.set('quiro-token', token, {
            maxAge: 60 * 10, // 10 min
          })
          clientCookie.set('quiro-refresh-token', refreshToken, {
            maxAge: 60 * 60 * 24 * 15, // 15 dias,
          })

          setUser(userData)
          router.push('/')
        }
      } else {
        return userResponse
      }
    }
  }
  async function singOut() {
    const refreshToken = clientCookie.get('quiro-refresh-token')
    await clientUserService.logout(refreshToken!)
    clientCookie.delete('quiro-token')
    clientCookie.delete('quiro-refresh-token')

    setUser(null)
    router.push('/login')
  }

  return (
    <AuthContext.Provider value={{ singIn, user, singOut }}>
      {children}
    </AuthContext.Provider>
  )
}
