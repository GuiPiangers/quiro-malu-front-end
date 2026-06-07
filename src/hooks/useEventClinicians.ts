'use client'

import { useQuery } from '@tanstack/react-query'
import { listClinicians } from '@/services/clinicUsers/clinicUsers'
import { Validate } from '@/services/api/Validate'

export const eventCliniciansQueryKey = ['clinicians', 'events'] as const

export function useEventClinicians() {
  return useQuery({
    queryKey: eventCliniciansQueryKey,
    queryFn: async () => {
      const result = await listClinicians()
      if (Validate.isError(result)) throw new Error(result.message)
      return result
    },
  })
}
