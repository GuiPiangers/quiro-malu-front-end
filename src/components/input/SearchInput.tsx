'use client'

import { IoIosSearch } from 'react-icons/io'
import { Input } from '.'
import { useRouter, useSearchParams } from 'next/navigation'
import { generateSearchParams } from '@/utils/generateSearchParams'
import { convertEntriesToObject } from '@/utils/convertEntriesToObject'

type SearchInputProps = {
  className?: string
  search?: {
    param: string
  }
}

export default function SearchInput({ className, search }: SearchInputProps) {
  const route = useRouter()
  const searchParams = useSearchParams()
  const searchParamsObject = convertEntriesToObject(
    Array.from(searchParams.entries()),
  )

  return (
    <Input.Root>
      <Input.Field
        onChange={(e) => {
          if (!search) return
          const params = generateSearchParams({
            ...searchParamsObject,
            [search.param]: e.target.value,
          })
          route.push(params)
        }}
        className={className}
        placeholder="Pesquisar..."
        autoComplete="off"
        startAdornment={<IoIosSearch size={24} className="ml-3" />}
      ></Input.Field>
    </Input.Root>
  )
}
