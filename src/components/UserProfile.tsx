'use client'

import { AuthContext } from '@/contexts/AuthContext'
import { useContext } from 'react'
import Button from './Button'
import { clientUserService } from '@/services/user/clientUserService'

export default function UserProfile() {
  const { user, singOut } = useContext(AuthContext)

  return (
    <div>
      <p>{user?.name}</p>
      <p>{user?.email}</p>
      <Button color="remove" onClick={singOut}>
        Sair
      </Button>
    </div>
  )
}
