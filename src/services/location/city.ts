'use server'

import { responseError } from '../api/api'

export type listStatesResponse = { uf: string; name: string }[]

export async function listCities(
  uf: string,
): Promise<string[] | responseError> {
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
