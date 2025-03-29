import { listStates } from '@/services/location/location'
import { Input } from '..'
import { Validate } from '@/services/api/Validate'

export default async function StateOptions() {
  const data = await listStates().then((res) =>
    Validate.isOk(res) ? res : undefined,
  )
  return (
    <>
      {data?.map((state) => (
        <Input.Option key={state.name} value={state}>
          {state.name}
        </Input.Option>
      ))}
    </>
  )
}
