import { cn } from '@/lib/utils'

interface FinHubScoreProps {
  score: number | null | undefined
  label: string | null | undefined
  coverage?: number | null
  dataPeriod?: string | null
}

export function FinHubScore({ score, label, coverage, dataPeriod }: FinHubScoreProps) {
  if (score == null) return null

  const color =
    score >= 75
      ? 'text-green-600 dark:text-green-400'
      : score >= 55
        ? 'text-blue-600 dark:text-blue-400'
        : score >= 40
          ? 'text-yellow-600 dark:text-yellow-400'
          : 'text-red-600 dark:text-red-400'

  const barColor =
    score >= 75
      ? 'bg-green-500'
      : score >= 55
        ? 'bg-blue-500'
        : score >= 40
          ? 'bg-yellow-500'
          : 'bg-red-500'

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-muted-foreground">FinHub Score</span>
          {coverage != null && (
            <span className="rounded bg-muted/60 px-1.5 py-0.5 text-[10px] text-muted-foreground">
              {coverage}/4 métricas
            </span>
          )}
          {dataPeriod && (
            <span className="rounded bg-muted/60 px-1.5 py-0.5 text-[10px] text-muted-foreground">
              {dataPeriod}
            </span>
          )}
        </div>
        <div className={cn('text-2xl font-bold tabular-nums', color)}>
          {score}
          <span className="text-sm font-normal text-muted-foreground">/100</span>
        </div>
      </div>

      {/* Barra de progresso */}
      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all', barColor)}
          style={{ width: `${score}%` }}
        />
      </div>

      {label && (
        <p className="text-xs text-muted-foreground">
          Classificação: <span className={cn('font-semibold', color)}>{label}</span> — combinação de
          Qualidade, Crescimento, Valuation e Risco.
        </p>
      )}
    </div>
  )
}
