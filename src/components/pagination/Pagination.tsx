type PaginationProps = {
  page: number
  limit: number
  total: number
  navegate(page: number): void
}

export default function Pagination({
  page,
  limit,
  total,
  navegate,
}: PaginationProps) {
  const qtdPages = Math.ceil(total / limit)
  return <div></div>
}
