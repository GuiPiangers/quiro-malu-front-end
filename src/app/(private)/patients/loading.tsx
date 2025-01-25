import TableSkeleton from '@/components/skeleton/TableSkeleton'
import { Box } from '@/components/box/Box'
import Button from '@/components/Button'
import Link from 'next/link'
import { Input } from '@/components/input'
import { IoIosSearch } from 'react-icons/io'

export default function loadingPatients() {
  return (
    <Box className="w-full max-w-screen-lg">
      <div className="mb-6 grid grid-cols-1 items-center gap-4 sm:grid-cols-[1fr_auto]">
        <Input.Root>
          <Input.Field
            placeholder="Pesquisar..."
            autoComplete="off"
            startAdornment={<IoIosSearch size={24} className="ml-3" />}
          ></Input.Field>
        </Input.Root>
        <Button asChild color="green">
          <Link href="/patients/create">Cadastrar</Link>
        </Button>
      </div>

      <TableSkeleton columns={['1fr', '1fr', '80px']} />
    </Box>
  )
}
