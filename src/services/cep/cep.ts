'use service'

import { removeNotNumbers } from '@/utils/removeNotNumbers'
import { responseError } from '../api/api'

type SearchAddressByCepError = { error: boolean }
type SearchAddressByCepSuccess = {
  cep: string
  logradouro: string
  bairro: string
  localidade: string
  estado: string
}

type SearchAddressByCepResponse =
  | SearchAddressByCepError
  | SearchAddressByCepSuccess

export async function searchAddressByCep(cep: string) {
  try {
    const validateSearchAddressByCepError = (
      response: SearchAddressByCepResponse,
    ): response is SearchAddressByCepError => {
      return Object.hasOwn(result, 'error')
    }

    const value = removeNotNumbers(cep)

    const response = await fetch(`https://viacep.com.br/ws/${value}/json/`)
    if (response.status !== 200) throw new Error('Cep não encontrado')

    const result: SearchAddressByCepResponse = await response.json()

    if (validateSearchAddressByCepError(result))
      throw new Error('Cep não encontrado')

    return result
  } catch (error: any) {
    return {
      error: true,
      message: error.message,
      statusCode: 400,
      type: 'cep',
    } as responseError
  }
}
