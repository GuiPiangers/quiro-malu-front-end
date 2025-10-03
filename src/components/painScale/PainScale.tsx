'use client'

import { useState, ChangeEvent, FC, InputHTMLAttributes } from 'react'

interface PainScaleProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value?: number
  onChange?: (value: number) => void
  defaultValue?: number
}

const PainScale: FC<PainScaleProps> = ({
  value: controlledValue,
  onChange,
  defaultValue,
  ...props
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue ?? 5)
  const isControlled = controlledValue !== undefined
  const value = isControlled ? controlledValue : internalValue

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(event.target.value)
    if (isControlled) {
      onChange?.(newValue)
    } else {
      setInternalValue(newValue)
    }
  }

  const percentage = (value / 10) * 100

  return (
    <div className="w-full">
      <div className="relative h-10 w-full">
        <div
          className="absolute text-center"
          style={{
            left: `${percentage}%`,
            transform: 'translateX(-50%)',
            bottom: '20px',
          }}
        >
          <span className="text-lg font-bold text-slate-700">{value}</span>
        </div>
        <input
          type="range"
          min="0"
          max="10"
          step="1"
          value={value}
          onChange={handleChange}
          className="
                absolute bottom-0 h-2 w-full cursor-pointer appearance-none bg-transparent
                [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-slate-600 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:shadow-md [&::-moz-range-track]:h-2 [&::-moz-range-track]:w-full
                [&::-moz-range-track]:cursor-pointer [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-gradient-to-r [&::-moz-range-track]:from-lime-300 [&::-moz-range-track]:via-amber-400 [&::-moz-range-track]:to-orange-600 [&::-webkit-slider-runnable-track]:h-2 [&::-webkit-slider-runnable-track]:w-full

                [&::-webkit-slider-runnable-track]:cursor-pointer [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-gradient-to-r [&::-webkit-slider-runnable-track]:from-lime-300 [&::-webkit-slider-runnable-track]:via-amber-400 [&::-webkit-slider-runnable-track]:to-orange-600 [&::-webkit-slider-thumb]:mt-[-6px] [&::-webkit-slider-thumb]:h-5
                [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-slate-600 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-md
              "
          {...props}
        />
      </div>
      <div className="flex w-full justify-between text-sm text-slate-500">
        <span>0</span>
        <span>10</span>
      </div>
    </div>
  )
}

export default PainScale
