'use client'

import { IoIosSearch } from 'react-icons/io'
import { Input } from '.'
import { useRouter, useSearchParams } from 'next/navigation'
import { generateSearchParams } from '@/utils/generateSearchParams'
import { convertEntriesToObject } from '@/utils/convertEntriesToObject'
import { useDebouncing } from '@/hooks/useDebouncing'
import { useCallback, useEffect, useState } from 'react'

type SearchInputProps = {
  className?: string
  searchParam: string
}

export default function SearchInput({
  className,
  searchParam,
}: SearchInputProps) {
  const route = useRouter()
  const searchParams = useSearchParams()
  const searchParamsObject = convertEntriesToObject(
    Array.from(searchParams.entries()),
  )
  const [debouncedSearch, setValue] = useDebouncing(300)

  useEffect(() => {
    const params = generateSearchParams({
      ...searchParamsObject,
      page: '1',
      [searchParam]: debouncedSearch,
    })
    route.push(params)
  }, [debouncedSearch])

  return (
    <Input.Root>
      <Input.Field
        onChange={(e) => {
          setValue(e.target.value)
        }}
        className={className}
        placeholder="Pesquisar..."
        autoComplete="off"
        startAdornment={<IoIosSearch size={24} className="ml-3" />}
      ></Input.Field>
    </Input.Root>
  )
}
