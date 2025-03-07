import { ParamsType } from '../page'
import { Box } from '@/components/box/Box'
import ProgressModal from './components/ProgressModal'
import DateTime from '@/utils/Date'
import DeleteProgress from './components/DeleteProgress'
import Pagination from '@/components/pagination/Pagination'
import NoDataFound from '@/components/notFound/NoDataFound'
import { Validate } from '@/services/api/Validate'
import { listProgress } from '@/services/patient/patient'

export default async function Progress({
  params,
  searchParams,
}: {
  params: ParamsType
  searchParams: { [key: string]: string | undefined }
}) {
  const patientId = params.id
  const page =
    searchParams.page && +searchParams.page > 0 ? searchParams.page : '1'
  const patientData = await listProgress({
    patientId,
    page,
  }).then((res) => (Validate.isOk(res) ? res : undefined))

  const generateProgress = () => {
    return (
      <div className="relative flex w-full gap-5">
        <div className="w-1 rounded-full bg-purple-200"></div>
        <div className="w-full space-y-4">
          {patientData?.progress.map((progress) => (
            <Box key={progress.id} className="flex justify-between gap-4">
              <div className="flex flex-col gap-2">
                <div className="absolute left-0.5 h-3.5 w-3.5 -translate-x-1/2 rounded-full bg-main"></div>
                <h4 className="text-xl font-semibold text-main">
                  {DateTime.getLocaleDate(progress.date)}
                </h4>
                <div>
                  <h4 className="font-semibold text-main">Serviços</h4>
                  <p className="text-sm">{progress.service}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-main">Procedimentos</h4>
                  <p className="text-sm">{progress.procedures}</p>
                </div>
              </div>
              <div className="grid place-content-end gap-3 sm:grid-cols-2">
                <DeleteProgress id={progress.id} patientId={patientId} />
                <ProgressModal
                  color="blue"
                  variant="outline"
                  size="small"
                  progressData={progress}
                >
                  Ver
                </ProgressModal>
              </div>
            </Box>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-screen-lg space-y-4">
      <Box className="flex min-w-min flex-col gap-6 rounded-2xl sm:flex-row">
        <ProgressModal
          progressData={{ patientId }}
          color="green"
          className="w-auto"
        >
          Adicionar
        </ProgressModal>
      </Box>
      {patientData && patientData.progress.length > 0 ? (
        generateProgress()
      ) : (
        <NoDataFound
          message={
            <div className="mt-2">
              <span>Nenhuma evolução registrada</span>
              <ProgressModal
                progressData={{ patientId }}
                size="small"
                className="mt-4 w-full"
                variant="outline"
                color="green"
              >
                Registrar evolução
              </ProgressModal>
            </div>
          }
        />
      )}
      <div className="grid place-items-center pt-4">
        <Pagination
          limit={patientData?.limit || 0}
          page={+page}
          total={patientData?.total || 0}
        />
      </div>
    </div>
  )
}
