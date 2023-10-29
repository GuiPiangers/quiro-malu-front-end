import { UserService } from './UserService'
import { serverApi } from '../api/serverApi'

const userService = new UserService(serverApi)

export { userService }
