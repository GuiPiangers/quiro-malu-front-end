import { IoIosSearch } from 'react-icons/io'
import { Input } from './input'

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
        leftIcon={<IoIosSearch size={24} />}
      ></Input.Field>
    </Input.Root>
  )
}
