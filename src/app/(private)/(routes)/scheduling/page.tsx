import { Input } from '@/components/formField'

export default function Scheduling() {
  return (
    <div className="w-full space-y-2 bg-white p-4">
      <Input.Root>
        <Input.Label>Isso</Input.Label>
        <Input.Select>
          <Input.Option value={10}>Isso aqu</Input.Option>
          <Input.Option value={20}>Vinte</Input.Option>
          <Input.Option value={30}>Trinta</Input.Option>
        </Input.Select>
      </Input.Root>
    </div>
  )
}
