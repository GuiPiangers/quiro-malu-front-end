'use client'

import { logoutUser } from '@/services/authentication/authentication'
import Button, { ButtonProps } from './Button'

export default function LogoutButton(props: ButtonProps) {
  return <Button onClick={() => logoutUser()} {...props} />
}
