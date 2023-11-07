import { Input } from '@/components/muiInput/Input'
import UnstyledSelectBasic from '@/components/select/Select'

export default function Scheduling() {
  return (
    <div className="space-y-2 bg-white p-4">
      <UnstyledSelectBasic></UnstyledSelectBasic>
      <Input></Input>
    </div>
  )
}
