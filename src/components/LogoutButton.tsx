'use client'

import { logoutUser } from '@/services/user/user'
import Button, { ButtonProps } from './Button'

export default function LogoutButton(props: ButtonProps) {
  return <Button onClick={() => logoutUser()} {...props} />
}
