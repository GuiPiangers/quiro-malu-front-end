'use client'

import { Time } from '@/utils/Time'
import { ChangeEvent, useEffect, useReducer, useState } from 'react'
import { Input } from '@/components/input'
import Button from '@/components/Button'
import { IoChevronUp } from 'react-icons/io5'

type timeState = {
  hours: number
  minutes: number
}

type TimeAction = {
  setValue(value: number): void
} & (
  | { type: 'incHour' }
  | { type: 'decHour' }
  | { type: 'changeHour'; value: number }
  | { type: 'incMinute' }
  | { type: 'decMinute' }
  | { type: 'changeMinute'; value: number }
)

const reducer = (state: timeState, action: TimeAction) => {
  switch (action.type) {
    case 'incHour':
      action.setValue(
        Time.hoursAndMinutesToSec({
          hours: state.hours + 1,
          minutes: state.minutes,
        }),
      )
      return {
        ...state,
        hours: state.hours + 1,
      }
    case 'decHour':
      action.setValue(
        Time.hoursAndMinutesToSec({
          hours: state.hours - 1,
          minutes: state.minutes,
        }),
      )
      return {
        ...state,
        hours: state.hours - 1,
      }
    case 'changeHour':
      action.setValue(
        Time.hoursAndMinutesToSec({
          hours: action.value,
          minutes: state.minutes,
        }),
      )
      return {
        ...state,
        hours: action.value,
      }

    case 'incMinute':
      action.setValue(
        Time.hoursAndMinutesToSec({
          hours: state.hours,
          minutes: state.minutes + 1,
        }),
      )
      return {
        ...state,
        minutes: state.minutes + 1,
      }
    case 'decMinute':
      action.setValue(
        Time.hoursAndMinutesToSec({
          hours: state.hours,
          minutes: state.minutes - 1,
        }),
      )
      return {
        ...state,
        minutes: state.minutes - 1,
      }
    case 'changeMinute':
      action.setValue(
        Time.hoursAndMinutesToSec({
          hours: state.hours,
          minutes: action.value,
        }),
      )
      return {
        ...state,
        minutes: action.value,
      }
    default:
      return state
  }
}

type DurationProps = {
  duration?: number
  setValue(value: number): void
  errors?: string
}

export default function Duration({
  duration,
  errors,
  setValue,
}: DurationProps) {
  const [time, dispatch] = useReducer(reducer, {
    hours: duration ? Math.floor(duration / (60 * 60)) : 0,
    minutes: duration ? (duration % (60 * 60)) / 60 : 0,
  })
  const [otherDuration, setOtherDuration] = useState(
    duration !== 60 * 60 && duration !== 30 * 60,
  )
  const onlyNumber = (value: string) => {
    return value.replace(/\D/g, '')
  }
  const incrementHour = () => dispatch({ type: 'incHour', setValue })
  const decrementHour = () =>
    time.hours > 0 && dispatch({ type: 'decHour', setValue })

  const changeHour = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    dispatch({
      type: 'changeHour',
      value: +onlyNumber(e.target.value),
      setValue,
    })
  const incrementMinute = () => dispatch({ type: 'incMinute', setValue })
  const decrementMinute = () =>
    time.minutes > 0 && dispatch({ type: 'decMinute', setValue })

  const changeMinute = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) =>
    dispatch({
      type: 'changeMinute',
      value: +onlyNumber(e.target.value),
      setValue,
    })

  useEffect(() => {
    if (duration === undefined) return
    const newDuration = new Time(duration)
    dispatch({
      type: 'changeHour',
      value: newDuration.hours,
      setValue,
    })
    dispatch({
      type: 'changeMinute',
      value: newDuration.minutes,
      setValue,
    })
    setOtherDuration(duration !== 60 * 60 && duration !== 30 * 60)
  }, [duration, setValue])
  return (
    <Input.Root>
      <Input.Label
        notSave={
          Time.hoursAndMinutesToSec({
            hours: time.hours,
            minutes: time.minutes,
          }) !== duration
        }
      >
        Duração
      </Input.Label>
      <div className="flex gap-2">
        <Button
          type="button"
          color="blue"
          className="w-14 px-0"
          variant={
            Time.hoursAndMinutesToSec({
              hours: time.hours,
              minutes: time.minutes,
            }) ===
            60 * 60 * 1 // 1 hour
              ? 'solid'
              : 'outline'
          }
          onClick={() => {
            dispatch({ type: 'changeHour', value: 1, setValue })
            dispatch({ type: 'changeMinute', value: 0, setValue })
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
            Time.hoursAndMinutesToSec({
              hours: time.hours,
              minutes: time.minutes,
            }) ===
            30 * 60 // 30 min
              ? 'solid'
              : 'outline'
          }
          onClick={() => {
            dispatch({ type: 'changeHour', value: 0, setValue })
            dispatch({ type: 'changeMinute', value: 30, setValue })
            setOtherDuration(false)
          }}
        >
          30min
        </Button>

        {otherDuration ? (
          <>
            <div className="grid h-full grid-flow-col flex-col gap-x-1">
              <Input.Field
                className="row-span-2 w-12 max-w-[48px]"
                autoComplete="off"
                slotProps={{ input: { className: 'w-full pr-0' } }}
                endAdornment={<span className="pr-2">h</span>}
                onChange={changeHour}
                inputMode="numeric"
                value={time.hours}
              />
              <IoChevronUp
                onClick={incrementHour}
                className="h-full cursor-pointer rounded-t border-l border-r border-t  bg-slate-100 p-0.5 hover:bg-slate-200"
              />
              <IoChevronUp
                onClick={decrementHour}
                className="h-full rotate-180 cursor-pointer rounded-t border-l border-r border-t bg-slate-100 p-0.5 hover:bg-slate-200"
              />
            </div>

            <div className="grid h-full grid-flow-col flex-col gap-x-1">
              <Input.Field
                className="row-span-2 w-16 max-w-[64px]"
                autoComplete="off"
                slotProps={{
                  input: { className: 'w-full pr-0' },
                }}
                inputMode="numeric"
                endAdornment={<span className="pr-2">min</span>}
                onChange={changeMinute}
                value={time.minutes}
              />
              <IoChevronUp
                onClick={incrementMinute}
                className="h-full cursor-pointer rounded-t border-l border-r border-t  bg-slate-100 p-0.5 hover:bg-slate-200"
              />
              <IoChevronUp
                onClick={decrementMinute}
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
