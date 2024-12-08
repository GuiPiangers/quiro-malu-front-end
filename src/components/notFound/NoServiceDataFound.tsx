import CreateServiceModal from '@/app/(private)/services/components/CreateServiceModal'
import NoDataFound from './NoDataFound'

export function NoServicesDataFound() {
  return (
    <NoDataFound
      message={
        <div className="mt-2">
          <span>Nenhum serviço encontrado</span>
          <CreateServiceModal
            className="mt-4 w-full"
            variant="outline"
            size="small"
          >
            Adicionar serviço
          </CreateServiceModal>
        </div>
      }
    />
  )
}
