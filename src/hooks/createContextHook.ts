import { Context, useContext } from 'react'

export function CreateContextHook<T>(context: Context<T>) {
  const hookContext = useContext(context)

  if (hookContext === undefined) {
    throw new Error('Não está dentro do contexto')
  }

  return hookContext
}
