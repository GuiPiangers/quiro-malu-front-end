import { IoIosSearch } from 'react-icons/io'
import { Input } from '../input'

export default function SearchInputTemplate({
  className,
}: {
  className?: string
}) {
  return (
    <Input.Root>
      <Input.Field
        className={className}
        placeholder="Pesquisar..."
        autoComplete="off"
        startAdornment={<IoIosSearch size={24} className="ml-3" />}
      ></Input.Field>
    </Input.Root>
  )
}
