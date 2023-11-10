import { useId } from 'react'
import { tv } from 'tailwind-variants'

type RadioButtonProps = {
  label?: string
  name?: string
}

export default function RadioButton({ label, name }: RadioButtonProps) {
  const id = useId()
  return (
    <div className="flex">
      <input name={name} id={id} type="radio" className="peer hidden" />
      <label
        htmlFor={id}
        className='flex items-center gap-2 before:h-4 before:w-4 before:rounded-full before:bg-white before:outline before:outline-1 before:content-[""] peer-checked:before:border-4 peer-checked:before:border-white peer-checked:before:bg-main peer-checked:before:outline-main'
      >
        {label}
      </label>
    </div>
  )
}
