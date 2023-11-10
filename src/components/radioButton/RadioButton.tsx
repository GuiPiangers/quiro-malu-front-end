'use client'

import { useId, useState } from 'react'

type RadioButtonProps = {
  label?: string
  name?: string
}

export default function RadioButton({ label, name }: RadioButtonProps) {
  const id = useId()

  return (
    <div className="flex">
      <input
        name={name}
        id={id}
        type="radio"
        className="peer h-0 w-0 opacity-0"
      />
      <label
        htmlFor={id}
        className='flex items-center gap-2 text-sm ease-out before:h-[14px] before:w-[14px] before:rounded-full before:border-[3.5px] before:border-white 
        before:bg-white before:outline before:outline-1 before:transition-colors 
        before:content-[""] peer-checked:before:border-white peer-checked:before:bg-main peer-checked:before:outline-main
        peer-focus:before:outline-main peer-focus:before:ring-4 
        peer-focus:before:ring-purple-200'
      >
        {label}
      </label>
    </div>
  )
}