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
  uf: string
}

type SearchAddressByCepResponse =
  | SearchAddressByCepError
  | SearchAddressByCepSuccess

export type listStatesResponse = { uf: string; name: string }[]

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
      uf: result.uf,
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

export async function listStates(): Promise<
  listStatesResponse | responseError
> {
  try {
    const response = await fetch(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome`,
    )

    const states = await response.json()

    return states.map((state: { sigla: string; nome: string }) => {
      return {
        uf: state.sigla,
        name: state.nome,
      }
    })
  } catch (error: any) {
    return {
      error: true,
      message: error.message,
      statusCode: 400,
      type: 'location.state',
    } as responseError
  }
}

export async function listCities(uf: string) {
  try {
    if (uf.length !== 2) throw new Error('O UF informado está incorreto')

    const response = await fetch(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf.toUpperCase()}/municipios`,
    )

    const states = await response.json()

    return states.map((state: { nome: string }) => {
      return state.nome
    })
  } catch (error: any) {
    return {
      error: true,
      message: error.message,
      statusCode: 400,
      type: 'location.state',
    } as responseError
  }
}
