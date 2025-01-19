import ExamFile from '@/components/exam/ExamFile'
import { listExams } from '@/services/exam/exam'
import { ParamsType } from '../page'
import { Validate } from '@/services/api/Validate'
import { decode } from 'utf8'
import { Box } from '@/components/box/Box'
import ExamFileInput from '@/components/exam/ExamFileInput'
import ExamsList from '@/components/exam/ExamsList'
import { titleStyles } from '@/components/form/Styles'

export default async function Exams({ params }: { params: ParamsType }) {
  const patientId = params.id
  const examsData = await listExams({ patientId, page: 1 })

  const exams = Validate.isOk(examsData) ? examsData.exams : []
  const total = Validate.isOk(examsData) ? examsData.total : 0

  return (
    <section className="w-full max-w-screen-lg">
      <Box className="flex w-full flex-col gap-4">
        <h2 className={titleStyles({ className: 'm-0' })}>Exames</h2>
        <ExamFileInput
          patientId={patientId}
          className="text-md"
        ></ExamFileInput>
        {<ExamsList exams={exams} total={total} patientId={patientId} />}
      </Box>
    </section>
  )
}
