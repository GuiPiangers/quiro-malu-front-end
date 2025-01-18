import Link from 'next/link'
import { IoDocumentTextOutline } from 'react-icons/io5'

type ExamFileProps = {
  fileUrl: string
  fileName: string
}

export default function ExamFile({ fileUrl, fileName }: ExamFileProps) {
  return (
    <a
      className="flex flex-col items-center gap-2"
      href={fileUrl}
      target="_blank"
    >
      <div className="group flex h-24 w-24 items-center justify-center rounded-md border border-main hover:border-main-hover">
        <IoDocumentTextOutline
          size={28}
          className="text-main group-hover:text-main-hover"
        />
      </div>
      <span className="text-md">{fileName}</span>
    </a>
  )
}
