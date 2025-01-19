import { IoDocumentTextOutline } from 'react-icons/io5'

type ExamFileProps = {
  fileUrl: string
  fileName: string
}

export default function ExamFile({ fileUrl, fileName }: ExamFileProps) {
  return (
    <a
      className="flex items-center gap-2 rounded-md border border-main px-2 py-1 hover:bg-slate-50"
      href={fileUrl}
      target="_blank"
    >
      <IoDocumentTextOutline
        size={28}
        className="text-main group-hover:text-main-hover"
      />
      <span className="text-md relative overflow-hidden overflow-ellipsis whitespace-nowrap">
        {fileName}
      </span>
    </a>
  )
}
