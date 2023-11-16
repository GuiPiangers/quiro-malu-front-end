'use client'

import { Input } from '@/components/formField'
import { useState } from 'react'

export default function Scheduling() {
  const [date, setDate] = useState('')
  return (
    <div className="w-full space-y-2 bg-white p-4">
      <Input.Root>
        <Input.Label>Isso</Input.Label>
        <Input.Field
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        ></Input.Field>
      </Input.Root>
      <p>{date}</p>
    </div>
  )
}
