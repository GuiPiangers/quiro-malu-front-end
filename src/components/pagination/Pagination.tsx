'use client'

import useWindowSize from '@/hooks/useWindowSize'
import { convertEntriesToObject } from '@/utils/convertEntriesToObject'
import { generateSearchParams } from '@/utils/generateSearchParams'
import { useRouter, useSearchParams } from 'next/navigation'
import { RxCaretLeft, RxCaretRight } from 'react-icons/rx'

type PaginationProps = {
  page: number
  limit: number
  total: number
}

const PaginationItem = ({
  number,
  active,
  handleClick,
}: {
  number: number
  active: boolean
  handleClick(): void
}) => {
  return (
    <button
      data-active={active}
      type="button"
      className="grid h-8 w-8 place-items-center rounded-md bg-white shadow hover:bg-purple-100 data-[active='true']:bg-main data-[active='true']:text-white data-[active='true']:hover:bg-main-hover"
      onClick={handleClick}
    >
      {number}
    </button>
  )
}

export default function Pagination({ page, limit, total }: PaginationProps) {
  const router = useRouter()

  const searchParams = useSearchParams()
  const searchParamsObject = convertEntriesToObject(
    Array.from(searchParams.entries()),
  )

  const qtdPages = Math.ceil(total / limit)
  const lastPage = page === qtdPages
  const firstPage = page === 1

  const { windowWidth } = useWindowSize()

  const navigate = (page: number) => {
    const params = generateSearchParams({
      ...searchParamsObject,
      page: page.toString(),
    })
    router.push(params)
  }

  const next = () => {
    if (!lastPage) navigate(page + 1)
  }
  const prev = () => {
    if (!firstPage) navigate(page - 1)
  }

  const generatePaginationItems = () => {
    const isSmScreen = windowWidth <= 640
    const totalVisibleNumbers = isSmScreen ? 5 : 10

    const arrayNumbers = Array.from({ length: qtdPages }, (_, i) => i + 1)
    const pagNumbers = arrayNumbers.filter((number, index) => {
      if (index === 0) return true
      if (
        number < page &&
        !(number >= arrayNumbers.length - totalVisibleNumbers - 2)
      )
        return false
      if (
        arrayNumbers.length - totalVisibleNumbers - 1 >= page &&
        page + totalVisibleNumbers - 1 > number
      )
        return true
      if (
        number >= arrayNumbers.length - totalVisibleNumbers - 1 &&
        page + totalVisibleNumbers - 1 > number
      )
        return true
      return false
    })
    return pagNumbers.map((number, index) => {
      const itemNum = index === 0 ? 1 : number
      return (
        <PaginationItem
          handleClick={() => {
            if (page !== itemNum) navigate(itemNum)
          }}
          key={itemNum}
          number={itemNum}
          active={page === itemNum}
        />
      )
    })
  }

  return (
    <>
      {qtdPages > 1 && (
        <div className=" flex gap-1">
          <button
            type="button"
            disabled={firstPage}
            onClick={prev}
            className="grid h-8 w-8 place-items-center rounded-md bg-white shadow hover:bg-slate-100 disabled:bg-slate-50 disabled:text-slate-400"
          >
            <RxCaretLeft size={24} />
          </button>

          {generatePaginationItems()}

          <button
            type="button"
            disabled={lastPage}
            onClick={next}
            className="grid h-8 w-8 place-items-center rounded-md bg-white shadow hover:bg-slate-100 disabled:bg-slate-50 disabled:text-slate-400"
          >
            <RxCaretRight size={24} />
          </button>
        </div>
      )}
    </>
  )
}
