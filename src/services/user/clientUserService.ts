import { UserService } from './UserService'
import { api } from '../api/api'

const clientUserService = new UserService(api)

export { clientUserService }
