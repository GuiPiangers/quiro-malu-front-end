import { responseError } from '../api/api'

export type listStatesResponse = { uf: string; name: string }[]

const brasilStates = {
  Acre: 'AC',
  Alagoas: 'AL',
  Amapá: 'AP',
  Amazonas: 'AM',
  Bahia: 'BA',
  Ceará: 'CE',
  'Distrito Federal': 'DF',
  'Espírito Santo': 'ES',
  Goiás: 'GO',
  Maranhão: 'MA',
  'Mato Grosso': 'MT',
  'Mato Grosso do Sul': 'MS',
  'Minas Gerais': 'MG',
  Pará: 'PA',
  Paraíba: 'PB',
  Paraná: 'PR',
  Pernambuco: 'PE',
  Piauí: 'PI',
  'Rio de Janeiro': 'RJ',
  'Rio Grande do Norte': 'RN',
  'Rio Grande do Sul': 'RS',
  Rondônia: 'RO',
  Roraima: 'RR',
  'Santa Catarina': 'SC',
  'São Paulo': 'SP',
  Sergipe: 'SE',
  Tocantins: 'TO',
}

export function listStates(): string[] | responseError {
  try {
    const states = Object.keys(brasilStates)

    return states
  } catch (error: any) {
    return {
      error: true,
      message: error.message,
      statusCode: 400,
      type: 'location.state',
    } as responseError
  }
}

export function getStateAcronym(state: string) {
  return brasilStates[state as keyof typeof brasilStates]
}
