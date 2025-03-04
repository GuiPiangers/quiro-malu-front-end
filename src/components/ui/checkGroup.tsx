import { FaMinus, FaPlus } from 'react-icons/fa6'
import StopPropagation from '../StopPropagation'

type CheckGroupProps = {
  onClick?(): void
  isChecked?: boolean
}

export default function CheckGroup({ onClick, isChecked }: CheckGroupProps) {
  return (
    <StopPropagation>
      <span
        onClick={() => {
          onClick && onClick()
        }}
        className="flex items-center justify-center rounded-sm  border border-blue-500 data-[checked=true]:bg-blue-500"
        data-checked={isChecked}
      >
        {isChecked ? (
          <FaMinus className="h-4.5 w-4.5 grid place-content-center text-white" />
        ) : (
          <FaPlus className="h-4.5 w-4.5 grid place-content-center text-blue-900" />
        )}
      </span>
    </StopPropagation>
  )
}
