'use client'

import Button from '@/components/Button'
import type { StrategyPatientListRow } from './types'
import { UserMinus } from 'lucide-react'

type StrategyPatientSelectedPanelProps = {
  title: string
  subtitle?: string
  selected: StrategyPatientListRow[]
  maxSelected: number
  submitting: boolean
  onRemove: (id: string) => void
  emptyMessage: string
}

export default function StrategyPatientSelectedPanel({
  title,
  subtitle,
  selected,
  maxSelected,
  submitting,
  onRemove,
  emptyMessage,
}: StrategyPatientSelectedPanelProps) {
  return (
    <div className="flex min-h-0 flex-col rounded-lg border border-main/30 bg-purple-50/40 p-4">
      <h4 className="mb-1 text-sm font-semibold text-main">
        {title} ({selected.length}/{maxSelected})
      </h4>
      {subtitle ? (
        <p className="mb-3 text-xs text-slate-600">{subtitle}</p>
      ) : null}
      <div className="max-h-[min(420px,55vh)] flex-1 space-y-1 overflow-y-auto">
        {selected.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">{emptyMessage}</p>
        ) : (
          selected.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
            >
              <div className="min-w-0">
                <p className="truncate font-medium text-slate-900">{p.name}</p>
                <p className="truncate text-slate-600">{p.phone}</p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="small"
                color="red"
                className="shrink-0 px-2"
                disabled={submitting}
                onClick={() => onRemove(p.id)}
                aria-label={`Remover ${p.name}`}
              >
                <UserMinus className="h-4 w-4" />
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
