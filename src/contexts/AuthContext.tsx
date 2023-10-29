'use client'

import { ReactNode, createContext, useState, useEffect } from 'react'
import { setCookie } from 'nookies'
import { useRouter } from 'next/navigation'

import { UserResponse } from '@/services/user/UserService'
import { clientUserService } from '@/services/user/clientUserService'

type SignInData = {
  email: string
  password: string
}
type AuthContextType = {
  isAuthenticated: boolean
  singIn(data: SignInData): void
  user: UserResponse['user'] | null
}

export const AuthContext = createContext({} as AuthContextType)

export function AuthContextProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserResponse['user'] | null>(null)
  const router = useRouter()

  const isAuthenticated = !!user

  useEffect(() => {
    const getUser = async () => {
      const userResponse = await clientUserService.get()
      if (userResponse) {
        const { name, email } = userResponse
        setUser({ name, email })
      }
    }
    getUser()
  }, [])

  async function singIn(data: SignInData) {
    const userResponse = await clientUserService.login(data)
    if (userResponse) {
      const { refreshToken, token, user: userData } = userResponse

      setCookie(undefined, 'quiro-token', token, {
        maxAge: 60 * 10, // 10 min
      })
      setCookie(undefined, 'quiro-refresh-token', refreshToken, {
        maxAge: 60 * 60 * 24 * 15, // 15 dias
      })

      setUser(userData)
      router.push('/')
    }
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, singIn, user }}>
      {children}
    </AuthContext.Provider>
  )
}
