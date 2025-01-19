import ExamFile from '@/components/exam/ExamFile'
import { listExams } from '@/services/exam/exam'
import { ParamsType } from '../page'
import { Validate } from '@/services/api/Validate'
import { decode } from 'utf8'
import { Box } from '@/components/box/Box'
import ExamFileInput from '@/components/exam/ExamFileInput'
import ExamsList from '@/components/exam/ExamsList'

export default async function Exams({ params }: { params: ParamsType }) {
  const patientId = params.id
  const examsData = await listExams({ patientId, page: 1 })

  const exams = Validate.isOk(examsData) ? examsData.exams : []
  const total = Validate.isOk(examsData) ? examsData.total : 0

  return (
    <section>
      <Box className="flex flex-col gap-4">
        {<ExamsList exams={exams} total={total} patientId={patientId} />}
        <ExamFileInput patientId={patientId}></ExamFileInput>
      </Box>
    </section>
  )
}
