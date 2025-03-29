'use service'

import { responseError } from '../api/api'
import Cep from '@/utils/Cep'
import { LocationDTO } from '../patient/patient'

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

export async function searchAddressByCep(
  cep: string,
): Promise<LocationDTO | responseError> {
  try {
    const validateSearchAddressByCepError = (
      response: SearchAddressByCepResponse,
    ): response is SearchAddressByCepError => {
      return Object.hasOwn(result, 'error')
    }

    if (!Cep.validate(cep)) throw new Error('Cep está formatado incorretamente')

    const value = Cep.unformat(cep)

    const response = await fetch(`https://viacep.com.br/ws/${value}/json/`)
    if (response.status !== 200) throw new Error('Cep não encontrado')

    const result: SearchAddressByCepResponse = await response.json()

    if (validateSearchAddressByCepError(result))
      throw new Error('Cep não encontrado')

    return {
      state: result.estado,
      city: result.localidade,
      cep: Cep.format(result.cep),
      neighborhood: result.bairro,
      address: result.logradouro,
    } as LocationDTO
  } catch (error: any) {
    return {
      error: true,
      message: error.message,
      statusCode: 400,
      type: 'cep',
    } as responseError
  }
}
