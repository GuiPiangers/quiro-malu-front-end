import { Input } from '@/components/input'
import UnstyledSelectBasic from '@/components/select/Select'

export default function Scheduling() {
  return (
    <div>
      <UnstyledSelectBasic></UnstyledSelectBasic>
      <Input.Root>
        <Input.Label>Input</Input.Label>
        <Input.Field />
      </Input.Root>
    </div>
  )
}
