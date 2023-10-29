'use client'

import { AuthContext } from '@/contexts/AuthContext'
import { useContext } from 'react'

export default function UserProfile() {
  const { user } = useContext(AuthContext)

  return (
    <div>
      <p>{user?.name}</p>
      <p>{user?.email}</p>
    </div>
  )
}
