import Input from './Input'
import { IoIosSearch } from 'react-icons/io'

type SearchInputProps = {
  className?: string
}

export default function SearchInput({ className }: SearchInputProps) {
  return (
    <Input
      className={className}
      placeholder="Pesquisar..."
      autoComplete="off"
      leftIcon={<IoIosSearch size={24} />}
    />
  )
}
