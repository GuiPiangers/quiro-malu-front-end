import { IoDocumentTextOutline } from 'react-icons/io5'
import { FiTrash } from 'react-icons/fi'
import { deleteExam, restoreExam } from '@/services/exam/exam'
import { useQueryClient } from '@tanstack/react-query'
import { useToast } from '@/hooks/use-toast'
import { ToastAction } from '../ui/toast'
import { twMerge } from 'tailwind-merge'

type ExamFileProps = {
  fileUrl: string
  fileName: string
  className?: string
  examData: {
    patientId: string
    id: string
  }
}

export default function ExamFile({
  fileUrl,
  fileName,
  className,
  examData: { id, patientId },
}: ExamFileProps) {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return (
    <a
      className={twMerge(
        'flex items-center justify-between gap-2 rounded-md border border-main px-2 py-1 hover:bg-slate-50',
        className,
      )}
      href={fileUrl}
      target="_blank"
    >
      <div className="flex items-center gap-2">
        <IoDocumentTextOutline size={28} className="flex-shrink-0 text-main" />
        <span className="text-md">{fileName}</span>
      </div>

      <div
        className="rounded px-2 py-1 hover:bg-red-100"
        onClick={(e) => {
          e.preventDefault()
          deleteExam({ id, patientId })
            .then(() =>
              queryClient.invalidateQueries({
                queryKey: ['exams', { patientId }],
              }),
            )
            .then(() => {
              toast({
                title: 'Exame deletado!',
                description: 'clique em desfazer para restaurar o exame',
                action: (
                  <ToastAction
                    altText="Restaurar exame deletado"
                    onClick={async () => {
                      await restoreExam({ id, patientId })
                      queryClient.invalidateQueries({
                        queryKey: ['exams', { patientId }],
                      })
                    }}
                  >
                    Desfazer
                  </ToastAction>
                ),
              })
            })
        }}
      >
        <FiTrash size={20} className="text-red-600 "></FiTrash>
      </div>
    </a>
  )
}
