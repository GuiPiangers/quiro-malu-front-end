'use client'

import { IoIosSearch } from 'react-icons/io'
import { Input } from '.'
import { useRouter, useSearchParams } from 'next/navigation'
import { generateSearchParams } from '@/utils/generateSearchParams'
import { convertEntriesToObject } from '@/utils/convertEntriesToObject'
import { useDebouncing } from '@/hooks/useDebouncing'
import { useEffect } from 'react'

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
  const [debouncedSearch, setValue] = useDebouncing()
  const searchValue = searchParams.get(searchParam) ?? ''

  useEffect(() => {
    const params = debouncedSearch
      ? generateSearchParams({
          ...searchParamsObject,
          page: '1',
          [searchParam]: debouncedSearch,
        })
      : generateSearchParams({
          ...searchParamsObject,
          [searchParam]: searchParamsObject[searchParam] ?? '',
        })
    route.push(params)
  }, [debouncedSearch, route, searchParam])

  return (
    <Input.Root>
      <Input.Field
        defaultValue={searchValue ?? ''}
        onChange={(e) => {
          setValue(e.target.value)
          if (e.currentTarget.value === '') {
            route.push(
              generateSearchParams({
                ...searchParamsObject,
                [searchParam]: '',
              }),
            )
          }
        }}
        className={className}
        placeholder="Pesquisar..."
        autoComplete="off"
        startAdornment={<IoIosSearch size={24} className="ml-3" />}
      ></Input.Field>
    </Input.Root>
  )
}
