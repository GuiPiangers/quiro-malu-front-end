'use client'

import { ReactNode, createContext, useState, useEffect } from 'react'
import { setCookie, parseCookies } from 'nookies'
import { useRouter } from 'next/navigation'

import { UserResponse, UserService } from '@/services/user/UserService'

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
  const userService = new UserService()
  const [user, setUser] = useState<UserResponse['user'] | null>(null)
  const router = useRouter()

  const isAuthenticated = !!user

  useEffect(() => {
    const { 'quiro-token': token } = parseCookies()
    const getUser = async () => {
      const userResponse = await userService.get(token)
      if (userResponse) {
        const { name, email } = userResponse
        setUser({ name, email })
      }
    }
    getUser()
  }, [])

  async function singIn(data: SignInData) {
    const userResponse = await userService.login(data)
    if (userResponse) {
      const { refreshToken, token, user: userData } = userResponse

      console.log(token)
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
