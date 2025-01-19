import { IoDocumentTextOutline } from 'react-icons/io5'
import { FiTrash } from 'react-icons/fi'
import { deleteExam } from '@/services/exam/exam'
import { useQueryClient } from '@tanstack/react-query'

type ExamFileProps = {
  fileUrl: string
  fileName: string
  examData: {
    patientId: string
    id: string
  }
}

export default function ExamFile({
  fileUrl,
  fileName,
  examData: { id, patientId },
}: ExamFileProps) {
  const queryClient = useQueryClient()

  return (
    <a
      className="flex items-center justify-between gap-2 rounded-md border border-main px-2 py-1 hover:bg-slate-50"
      href={fileUrl}
      target="_blank"
    >
      <div className="flex items-center gap-2">
        <IoDocumentTextOutline size={28} className="text-main " />
        <span className="text-md relative overflow-hidden overflow-ellipsis whitespace-nowrap">
          {fileName}
        </span>
      </div>

      <div
        className="rounded px-2 py-1 hover:bg-red-100"
        onClick={async () => {
          await deleteExam({ id, patientId })
          queryClient.invalidateQueries({ queryKey: ['exams'] })
        }}
      >
        <FiTrash
          size={20}
          onClick={(e) => e.preventDefault()}
          className="text-red-600 "
        ></FiTrash>
      </div>
    </a>
  )
}
