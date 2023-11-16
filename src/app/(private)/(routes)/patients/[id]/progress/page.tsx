import { patientService } from '@/services/patient/serverPatientService'
import { ParamsType } from '../page'
import { Box } from '@/components/Box/Box'
import Button from '@/components/Button'
import SearchInput from '@/components/SearchInput'
import Link from 'next/link'

export default async function Progress({ params }: { params: ParamsType }) {
  const patientId = params.id
  const progressList = await patientService.listProgress({ patientId })

  const generateProgress = () => {
    return (
      <div className="relative flex w-full gap-5">
        <div className="w-1 rounded-full bg-purple-200"></div>
        <div className="w-full space-y-4">
          {progressList.map((progress) => (
            <Box key={progress.id} className="flex justify-between gap-4">
              <div className="flex flex-col gap-2">
                <div className="absolute left-0.5 h-3.5 w-3.5 -translate-x-1/2 rounded-full bg-main"></div>
                <h4 className="text-xl font-bold text-main">
                  {new Intl.DateTimeFormat('pt-BR').format(
                    new Date(progress.date),
                  )}
                </h4>
                <div>
                  <h4 className="font-bold text-main">Serviços</h4>
                  <p className="text-sm">{progress.service}</p>
                </div>
                <div>
                  <h4 className="font-bold text-main">Procedimentos</h4>
                  <p className="text-sm">{progress.procedures}</p>
                </div>
              </div>
              <div className="grid place-content-end gap-3 sm:grid-cols-2">
                <Button
                  size="small"
                  variant="outline"
                  color="red"
                  className="w-20"
                >
                  Excluir
                </Button>
                <Button
                  asChild
                  size="small"
                  variant="outline"
                  color="blue"
                  className="w-20"
                >
                  <Link href={`/patients/${patientId}/progress/${progress.id}`}>
                    Ver
                  </Link>
                </Button>
              </div>
            </Box>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-screen-lg space-y-4">
      <Box className="flex gap-8 rounded-2xl">
        <SearchInput className="text-base" />
        <Button asChild color="green">
          <Link href="/patients/create">Cadastrar</Link>
        </Button>
      </Box>
      {generateProgress()}
    </div>
  )
}
