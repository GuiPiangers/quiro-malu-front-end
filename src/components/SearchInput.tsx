import { IoIosSearch } from 'react-icons/io'
import { Input } from './formField'

type SearchInputProps = {
  className?: string
}

export default function SearchInput({ className }: SearchInputProps) {
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
