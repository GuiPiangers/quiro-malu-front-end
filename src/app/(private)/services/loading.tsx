import TableSkeleton from '@/components/skeleton/TableSkeleton'
import CreateServiceModal from './components/CreateServiceModal'
import { Box } from '@/components/box/Box'
import SearchInputTemplate from '@/components/skeleton/SearchInputTemplate'

export default function loadingService() {
  return (
    <Box className="w-full max-w-screen-lg">
      <div className="mb-6 grid grid-cols-1 items-center gap-4 sm:grid-cols-[1fr_auto]">
        <SearchInputTemplate className="text-base" />
        <CreateServiceModal>Adicionar</CreateServiceModal>
      </div>
      <TableSkeleton
        columns={['2fr', '2fr', '1fr']}
        header={['Nome', 'Valor', 'Duração']}
      />
    </Box>
  )
}
