export type StrategyPatientListRow = {
  id: string
  name: string
  phone: string
}

/** @deprecated use StrategyPatientListRow */
export type SelectedListPatientRow = StrategyPatientListRow

export const STRATEGY_PATIENT_LIST_PAGE_LIMIT = 20
export const STRATEGY_PATIENT_LIST_MAX_SELECTED = 50
