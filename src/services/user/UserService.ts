type UserDTO = {
  name: string
  email: string
  phone: string
  password: string
}

type LoginData = {
  email: string
  password: string
}

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

  async register(data: UserDTO) {
    try {
      await fetch('http://localhost:8000/register', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      })
    } catch (err: any) {
      console.log(err.message)
    }
  }

  async login(data: LoginData): Promise<UserResponse | void> {
    try {
      const res = await this.fetchData<UserResponse>('/login', {
        method: 'POST',
        body: JSON.stringify(data),
      })
      return res
    } catch (err) {
      console.log(err)
    }
  }

  async logout(refreshTokenId: string): Promise<void> {
    try {
      await this.fetchData<UserResponse>('/logout', {
        method: 'POST',
        body: JSON.stringify({ refreshTokenId }),
      })
    } catch (err) {
      console.log(err)
    }
  }

  async get() {
    try {
      const res = await this.fetchData<UserResponse['user']>('/profile', {
        method: 'GET',
        cache: 'no-store',
      })

      return res
    } catch (err) {
      console.log(err)
    }
  }
}
