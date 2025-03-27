import { Dispatch, SetStateAction } from 'react'
import { Input } from '../input'
import { TriggerDTO } from '@/services/message/message'

type MessageEventSelectProps = {
  trigger: TriggerDTO<any>
  setTrigger: Dispatch<SetStateAction<TriggerDTO>>
}

function WithDelay({ setTrigger, trigger }: MessageEventSelectProps) {
  return (
    <div className="flex gap-4">
      <Input.Root>
        <Input.Label>Tempo</Input.Label>

        <Input.Field
          placeholder="Ex. 15"
          className=" overflow-hidden"
          onChange={(e) => {
            const value = e.target.value
            setTrigger((oldValue) => ({
              ...oldValue,
              delayOperator: +value,
            }))
          }}
        />
      </Input.Root>

      <Input.Root>
        <Input.Label>Unidade</Input.Label>
        <Input.Select
          value={trigger.config?.delayUnitOfTime}
          onChange={(e, inputValue) => {
            const value = inputValue as 'hours' | 'minutes' | 'days'
            setTrigger((oldValue) => ({
              ...oldValue,
              config: {
                delayUnitOfTime: value,
              },
            }))
          }}
        >
          <Input.Option value="minutes">Minutos</Input.Option>
          <Input.Option value="hours">Horas</Input.Option>
          <Input.Option value="days">Dias</Input.Option>
        </Input.Select>
      </Input.Root>

      <Input.Root>
        <Input.Label>Quando</Input.Label>

        <Input.Select
          value={
            trigger.config.delayOperator && trigger.config.delayOperator < 0
              ? 'before'
              : 'after'
          }
          onChange={(e, inputValue) => {
            const value =
              inputValue === 'after'
                ? trigger.config.delayOperator
                  ? Math.abs(trigger.config.delayOperator)
                  : 0
                : trigger.config.delayOperator
                ? -Math.abs(trigger.config.delayOperator)
                : 0

            setTrigger((oldValue) => ({
              ...oldValue,
              config: {
                delayOperator: value,
              },
            }))
          }}
        >
          <Input.Option value="after">Depois</Input.Option>
          <Input.Option value="before">Antes</Input.Option>
        </Input.Select>
      </Input.Root>
    </div>
  )
}

function WithDynamicDate({ setTrigger, trigger }: MessageEventSelectProps) {
  return (
    <div className="flex gap-4">
      <Input.Root>
        <Input.Label>Tempo</Input.Label>

        <Input.Field
          type="time"
          className=" overflow-hidden"
          onChange={(e) => {
            // const value = e.target.value
            // setTrigger((oldValue) => ({
            //   ...oldValue,
            //   delayOperator: +value,
            // }))
          }}
        />
      </Input.Root>
    </div>
  )
}

export function MessageEventSelect({
  trigger,
  setTrigger,
}: MessageEventSelectProps) {
  const isDelay = (event: string) => {
    const delayEvents = ['createSchedule', 'realizeSchedule', 'createPatient']

    return delayEvents.some((delayEvent) => delayEvent === event)
  }

  const isDynamicDate = (event: string) => {
    const delayEvents = ['patientBirthDay']

    return delayEvents.some((delayEvent) => delayEvent === event)
  }

  return (
    <div className="flex flex-col gap-4">
      <Input.Root>
        <Input.Label required>Evento</Input.Label>
        <Input.Select
          slotProps={{
            popper: { className: 'z-50' },
          }}
          value={trigger.event}
          onChange={(_, value) => {
            setTrigger((oldValue) => ({
              ...oldValue,
              event: value as string,
            }))
          }}
        >
          <Input.Option value={'createSchedule'}>
            Consulta agendada
          </Input.Option>

          <Input.Option value={'realizeSchedule'}>
            Consulta realizada
          </Input.Option>

          <Input.Option value={'patientBirthDay'}>
            Aniversário do paciente
          </Input.Option>

          <Input.Option value={'createPatient'}>
            Paciente registrado
          </Input.Option>

          <Input.Option value={'selectedDate'}>Data selecionada</Input.Option>
        </Input.Select>
      </Input.Root>

      {isDelay(trigger.event) && (
        <WithDelay setTrigger={setTrigger} trigger={trigger} />
      )}

      {isDynamicDate(trigger.event) && (
        <WithDynamicDate setTrigger={setTrigger} trigger={trigger} />
      )}
    </div>
  )
}
