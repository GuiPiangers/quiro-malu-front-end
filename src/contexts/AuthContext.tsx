'use client'

import { ReactNode, createContext } from 'react'
import { LoginResponse, UserService } from '@/services/user/UserService'

export const AuthContext = createContext({})

type AuthContextType = {
  isAuthenticated: boolean
}

type signInData = {
  email: string
  password: string
}

export function AuthContextProvider({ children }: { children: ReactNode }) {
  const isAuthenticated = false
  const userService = new UserService()

  async function singIn(data: signInData) {
    const { refreshToken, token, user } = (await userService.login(
      data,
    )) as LoginResponse
  }
  return (
    <AuthContext.Provider
      value={{ isAuthenticated, singIn } as AuthContextType}
    >
      {children}
    </AuthContext.Provider>
  )
}
