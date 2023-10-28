import { ReactNode, createContext } from 'react'

export const AuthContext = createContext({})

type AuthContextProps = {
  children: ReactNode
}

export function AuthProvider({ children }: AuthContextProps) {
  return <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>
}
