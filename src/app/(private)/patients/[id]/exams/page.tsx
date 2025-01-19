import Button from '@/components/Button'
import ExamFile from '@/components/exam/ExamFile'
import { listExams, saveExam } from '@/services/exam/exam'
import { ParamsType } from '../page'
import { Validate } from '@/services/api/Validate'
import { decode } from 'utf8'
import { Box } from '@/components/box/Box'
import { FileInput } from '@/components/input/file/FileInput'
import ExamFileInput from '@/components/exam/ExamFileInput'

export default async function Exams({ params }: { params: ParamsType }) {
  const patientId = params.id
  const examsData = await listExams({ patientId, page: 1 })

  const exams = Validate.isOk(examsData) ? examsData.exams : []
  const total = Validate.isOk(examsData) ? examsData.total : []

  return (
    <section>
      <Box className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          {exams.map((exam) => (
            <ExamFile
              key={exam.id}
              fileUrl={exam.url}
              fileName={decode(exam.fileName)}
            />
          ))}
          {/* <ExamFile fileUrl="/" fileName="quiro-exame.pdf" /> */}
        </div>
        <ExamFileInput patientId={patientId}></ExamFileInput>
      </Box>
    </section>
  )
}
