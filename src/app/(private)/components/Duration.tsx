'use client'

import { Time } from '@/utils/Time'
import { useEffect, useReducer, useState } from 'react'
import { Input } from '@/components/input'
import Button from '@/components/Button'
import { IoChevronUp } from 'react-icons/io5'

type TimeState = {
  hours: number
  minutes: number
}

type TimeAction =
  | { type: 'incrementHour' }
  | { type: 'decrementHour' }
  | { type: 'setHour'; value: number }
  | { type: 'incrementMinute' }
  | { type: 'decrementMinute' }
  | { type: 'setMinute'; value: number }

const reducer = (state: TimeState, action: TimeAction): TimeState => {
  switch (action.type) {
    case 'incrementHour':
      return { ...state, hours: state.hours + 1 }
    case 'decrementHour':
      return { ...state, hours: Math.max(state.hours - 1, 0) }
    case 'setHour':
      return { ...state, hours: action.value }
    case 'incrementMinute':
      return { ...state, minutes: state.minutes + 1 }
    case 'decrementMinute':
      return { ...state, minutes: Math.max(state.minutes - 1, 0) }
    case 'setMinute':
      return { ...state, minutes: action.value }
    default:
      return state
  }
}

type DurationProps = {
  duration?: number
  setValue(value: number): void
  errors?: string
  notSave?: boolean
}

export default function Duration({
  duration,
  setValue,
  errors,
  notSave,
}: DurationProps) {
  const initialState = {
    hours: duration ? Math.floor(duration / 3600) : 0,
    minutes: duration ? (duration % 3600) / 60 : 0,
  }

  const [time, dispatch] = useReducer(reducer, initialState)
  const [otherDuration, setOtherDuration] = useState(
    duration !== 3600 && duration !== 1800,
  )

  useEffect(() => {
    const seconds = Time.hoursAndMinutesToSec({
      hours: time.hours,
      minutes: time.minutes,
    })
    setValue(seconds)
  }, [time])

  useEffect(() => {
    if (duration !== undefined) {
      dispatch({ type: 'setHour', value: Math.floor(duration / 3600) })
      dispatch({ type: 'setMinute', value: (duration % 3600) / 60 })
      setOtherDuration(duration !== 3600 && duration !== 1800)
    }
  }, [duration])

  const onlyNumbers = (value: string) => value.replace(/\D/g, '')

  return (
    <Input.Root>
      <Input.Label notSave={notSave} required>
        Duração
      </Input.Label>
      <div className="flex gap-2">
        <Button
          type="button"
          color="blue"
          className="w-14 px-0"
          variant={
            Time.hoursAndMinutesToSec(time) === 3600 ? 'solid' : 'outline'
          }
          onClick={() => {
            dispatch({ type: 'setHour', value: 1 })
            dispatch({ type: 'setMinute', value: 0 })
            setOtherDuration(false)
          }}
        >
          1h
        </Button>
        <Button
          type="button"
          color="blue"
          className="w-14 px-0"
          variant={
            Time.hoursAndMinutesToSec(time) === 1800 ? 'solid' : 'outline'
          }
          onClick={() => {
            dispatch({ type: 'setHour', value: 0 })
            dispatch({ type: 'setMinute', value: 30 })
            setOtherDuration(false)
          }}
        >
          30min
        </Button>
        {otherDuration ? (
          <>
            <div className="grid h-full grid-flow-col gap-x-1">
              <Input.Field
                className="row-span-2 w-12 max-w-[48px]"
                autoComplete="off"
                inputMode="numeric"
                slotProps={{ input: { className: 'w-full pr-0' } }}
                endAdornment={<span className="pr-2">h</span>}
                onChange={(e) =>
                  dispatch({
                    type: 'setHour',
                    value: +onlyNumbers(e.target.value),
                  })
                }
                value={time.hours}
              />
              <IoChevronUp
                onClick={() => dispatch({ type: 'incrementHour' })}
                className="h-full cursor-pointer rounded-t border-l border-r border-t  bg-slate-100 p-0.5 hover:bg-slate-200"
              />
              <IoChevronUp
                onClick={() => dispatch({ type: 'decrementHour' })}
                className="h-full rotate-180 cursor-pointer rounded-t border-l border-r border-t bg-slate-100 p-0.5 hover:bg-slate-200"
              />
            </div>
            <div className="grid h-full grid-flow-col gap-x-1">
              <Input.Field
                className="row-span-2 w-16 max-w-[64px]"
                autoComplete="off"
                inputMode="numeric"
                slotProps={{ input: { className: 'w-full pr-0' } }}
                endAdornment={<span className="pr-2">min</span>}
                onChange={(e) =>
                  dispatch({
                    type: 'setMinute',
                    value: +onlyNumbers(e.target.value),
                  })
                }
                value={time.minutes}
              />
              <IoChevronUp
                onClick={() => dispatch({ type: 'incrementMinute' })}
                className="h-full cursor-pointer rounded-t border-l border-r border-t  bg-slate-100 p-0.5 hover:bg-slate-200"
              />
              <IoChevronUp
                onClick={() => dispatch({ type: 'decrementMinute' })}
                className="h-full rotate-180 cursor-pointer rounded-t border-l border-r border-t bg-slate-100 p-0.5 hover:bg-slate-200"
              />
            </div>
          </>
        ) : (
          <Button
            onClick={() => setOtherDuration(true)}
            type="button"
            variant="outline"
            color="blue"
          >
            Outra
          </Button>
        )}
      </div>
      {errors && <Input.Message error>{errors}</Input.Message>}
    </Input.Root>
  )
}
