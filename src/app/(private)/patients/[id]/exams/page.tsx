import Button from '@/components/Button'
import ExamFile from '@/components/examFile/ExamFile'
import { listExams, saveExam } from '@/services/exam/exam'
import { ParamsType } from '../page'
import { Validate } from '@/services/api/Validate'
import { decode } from 'utf8'
import { Box } from '@/components/box/Box'

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
        <form action={saveExam.bind(null, patientId)}>
          <label htmlFor="exam-input"></label>
          <input type="file" name="file" id="exam-input"></input>
          <Button>Enviar</Button>
        </form>
      </Box>
    </section>
  )
}
