'use client'

import { decode } from 'utf8'
import ExamFile from './ExamFile'
import { ExamsListResponse, listExams } from '@/services/exam/exam'
import { useInfiniteQuery } from '@tanstack/react-query'
import { Validate } from '@/services/api/Validate'

export default function ExamsList({
  exams = [],
  total = 0,
  patientId,
}: Partial<ExamsListResponse> & { patientId: string }) {
  const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ['exams'],
    queryFn: ({ pageParam }) => listExams({ page: pageParam, patientId }),
    initialPageParam: 1,
    initialData: {
      pages: [
        {
          exams,
          total,
        },
      ],
      pageParams: [1],
    },
    getNextPageParam: (lastPage, pages) => {
      const allExams =
        pages.flatMap((page) => {
          if (Validate.isOk(page)) return page.exams
          return []
        }) || exams

      const [total] =
        pages.flatMap((page) => {
          if (Validate.isOk(page)) return page.total
          return []
        }) || exams

      if (allExams.length === total) return undefined
      return pages.length + 1
    },
  })

  const allExams =
    data?.pages.flatMap((page) => {
      if (Validate.isOk(page)) return page.exams
      return []
    }) || exams

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        {allExams.map((exam) => (
          <ExamFile
            key={exam.id}
            fileUrl={exam.url}
            fileName={decode(exam.fileName)}
            examData={{ id: exam.id, patientId }}
          />
        ))}
      </div>

      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          className="text-main underline hover:text-main-hover"
        >
          Mostrar mais
        </button>
      )}
    </div>
  )
}
