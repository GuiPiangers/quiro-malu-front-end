'use client'

import Button from '@/components/Button'
import { Input } from '@/components/input'
import { Validate } from '@/services/api/Validate'
import type { PatientsListResponse } from '@/services/patient/patient'
import { UserPlus } from 'lucide-react'

type StrategyPatientPickerPanelProps = {
  title: string
  searchInput: string
  onSearchChange: (value: string) => void
  isPending: boolean
  patientPage: PatientsListResponse | undefined
  patientPageIsError: boolean
  availableRows: { id?: string; name: string; phone: string }[]
  page: number
  totalPages: number
  totalPatients: number
  onPrevPage: () => void
  onNextPage: () => void
  selectedCount: number
  maxSelected: number
  submitting: boolean
  onAdd: (row: { id?: string; name: string; phone: string }) => void
}

export default function StrategyPatientPickerPanel({
  title,
  searchInput,
  onSearchChange,
  isPending,
  patientPage,
  patientPageIsError,
  availableRows,
  page,
  totalPages,
  totalPatients,
  onPrevPage,
  onNextPage,
  selectedCount,
  maxSelected,
  submitting,
  onAdd,
}: StrategyPatientPickerPanelProps) {
  return (
    <div className="flex min-h-0 flex-col rounded-lg border border-slate-200 bg-white p-4">
      <h4 className="mb-3 text-sm font-semibold text-slate-800">{title}</h4>
      <Input.Root className="mb-3">
        <Input.Label className="sr-only">Buscar por nome</Input.Label>
        <Input.Field
          placeholder="Buscar por nome…"
          value={searchInput}
          onChange={(e) => onSearchChange(e.target.value)}
          autoComplete="off"
          disabled={submitting}
        />
      </Input.Root>

      <div className="min-h-[200px] flex-1 space-y-1 overflow-y-auto">
        {isPending ? (
          <p className="text-sm text-slate-500">Carregando…</p>
        ) : patientPageIsError ||
          (patientPage && Validate.isError(patientPage)) ? (
          <p className="text-sm text-red-600">
            Não foi possível carregar os pacientes.
          </p>
        ) : availableRows.length === 0 ? (
          <p className="text-sm text-slate-500">
            Nenhum paciente encontrado nesta página.
          </p>
        ) : (
          availableRows.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between gap-2 rounded-md border border-slate-100 bg-slate-50/80 px-3 py-2 text-sm"
            >
              <div className="min-w-0">
                <p className="truncate font-medium text-slate-900">{p.name}</p>
                <p className="truncate text-slate-600">{p.phone}</p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="small"
                color="green"
                className="shrink-0 px-2"
                disabled={submitting || selectedCount >= maxSelected || !p.id}
                onClick={() => onAdd(p)}
                aria-label={`Incluir ${p.name}`}
              >
                <UserPlus className="h-4 w-4" />
              </Button>
            </div>
          ))
        )}
      </div>

      {totalPages > 1 ? (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 text-xs text-slate-600">
          <span>
            Página {page} de {totalPages} ({totalPatients} pacientes)
          </span>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="small"
              disabled={page <= 1 || submitting}
              onClick={onPrevPage}
            >
              Anterior
            </Button>
            <Button
              type="button"
              variant="outline"
              size="small"
              disabled={page >= totalPages || submitting}
              onClick={onNextPage}
            >
              Próxima
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
