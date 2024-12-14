import clsx from 'clsx'
import { Table } from '../table'
import { Skeleton } from './Skeleton'

type TableSkeletonProps = {
  columns: string[]
  header?: string[]
  className?: string
  length?: number
}

export default function TableSkeleton({
  columns,
  header,
  className,
  length,
}: TableSkeletonProps) {
  const ArrayItems = Array.from(Array(length ?? 12).keys())

  console.log(ArrayItems.values())

  return (
    <Table.Root className={clsx(className, 'w-full')}>
      <Table.Row columns={columns}>
        {header?.map((field) => <Table.Head key={field}>{field}</Table.Head>)}
      </Table.Row>

      {ArrayItems.map((item) => (
        <Table.Row key={item} clickable columns={columns}>
          {columns.map((column, index) => (
            <Table.Cell key={index} className="w-full">
              <Skeleton className="h-7 w-full"></Skeleton>
            </Table.Cell>
          ))}
        </Table.Row>
      ))}
    </Table.Root>
  )
}
