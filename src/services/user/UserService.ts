import { CreateUserData } from '@/app/(authentication)/register/page'
import { SignInData } from '@/contexts/AuthContext'

export type UserResponse = {
  token: string
  refreshToken: string
  user: {
    name: string
    email: string
  }
}

export class UserService {
  constructor(
    private fetchData: <T>(
      input: RequestInfo,
      init?: RequestInit | undefined,
    ) => Promise<T>,
  ) {}

  async register(data: CreateUserData): Promise<CreateUserData> {
    const res = await fetch('http://localhost:8000/register', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    })
    return await res.json()
  }

  async login(data: SignInData): Promise<UserResponse | void> {
    const res = await this.fetchData<UserResponse>('/login', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    return res
  }

  async logout(refreshTokenId: string): Promise<void> {
    await this.fetchData<UserResponse>('/logout', {
      method: 'POST',
      body: JSON.stringify({ refreshTokenId }),
    })
  }

  async get() {
    const res = await this.fetchData<UserResponse['user']>('/profile', {
      method: 'GET',
      cache: 'no-store',
    })
    return res
  }
}
