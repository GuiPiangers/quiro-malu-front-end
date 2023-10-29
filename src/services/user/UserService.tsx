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
  async register(data: UserDTO) {
    try {
      await fetch('http://localhost:8000/register', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      })
    } catch (err) {
      console.log(err)
    }
  }

  async login(data: LoginData): Promise<UserResponse | void> {
    try {
      const res = await fetch('http://localhost:8000/login', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      })
      const respData = await res.json()
      return respData as UserResponse
    } catch (err) {
      console.log(err)
    }
  }

  async get(token: string): Promise<UserResponse['user'] | void> {
    try {
      const res = await fetch('http://localhost:8000/profile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      const respData = await res.json()
      console.log(respData)
      return respData as UserResponse['user']
    } catch (err) {
      console.log(err)
    }
  }
}
