type UserDTO = {
  name: string
  email: string
  phone: string
  password: string
}

type loginData = {
  email: string
  password: string
}

export type LoginResponse = {
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
      const res = await fetch('http://localhost:8000/register', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      })
      console.log()
      return res
    } catch (err) {
      console.log(err)
    }
  }

  async login(data: loginData): Promise<LoginResponse | undefined> {
    try {
      const res = await fetch('http://localhost:8000/login', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      })
      const respData = await res.json()
      return JSON.parse(respData) as LoginResponse
    } catch (err) {
      console.log(err)
    }
  }
}
