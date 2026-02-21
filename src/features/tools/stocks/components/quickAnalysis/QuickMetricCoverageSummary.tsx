import { StockData, QuickMetricStatus } from '@/features/tools/stocks/types/stocks'

interface QuickMetricCoverageSummaryProps {
  data: StockData
}

const STATUS_ORDER: QuickMetricStatus[] = [
  'ok',
  'calculated',
  'nao_aplicavel',
  'sem_dado_atual',
  'erro_fonte',
]

const STATUS_META: Record<QuickMetricStatus, { label: string; className: string }> = {
  ok: {
    label: 'Direto',
    className:
      'bg-emerald-500/10 text-emerald-700 border border-emerald-500/30 dark:text-emerald-300',
  },
  calculated: {
    label: 'Calculado',
    className: 'bg-sky-500/10 text-sky-700 border border-sky-500/30 dark:text-sky-300',
  },
  nao_aplicavel: {
    label: 'Nao aplicavel',
    className: 'bg-slate-500/10 text-slate-700 border border-slate-500/30 dark:text-slate-300',
  },
  sem_dado_atual: {
    label: 'Sem dado atual',
    className: 'bg-amber-500/10 text-amber-700 border border-amber-500/30 dark:text-amber-300',
  },
  erro_fonte: {
    label: 'Erro fonte',
    className: 'bg-rose-500/10 text-rose-700 border border-rose-500/30 dark:text-rose-300',
  },
}

export function QuickMetricCoverageSummary({ data }: QuickMetricCoverageSummaryProps) {
  const summary = data.quickMetricSummary
  const ingestion = data.quickMetricIngestion

  if (!summary && !ingestion) return null

  const resolvedSector = ingestion?.resolvedSector || data.sector || 'Setor nao identificado'
  const coreLabel =
    typeof summary?.coreTotal === 'number' && typeof summary?.coreReady === 'number'
      ? `${summary.coreReady}/${summary.coreTotal}`
      : '-'
  const optionalLabel =
    typeof summary?.optionalTotal === 'number' && typeof summary?.optionalReady === 'number'
      ? `${summary.optionalReady}/${summary.optionalTotal}`
      : '-'

  return (
    <section className="rounded-xl border border-border bg-card p-4 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            Qualidade de dados da Analise Rapida
          </h3>
          <p className="text-xs text-muted-foreground">
            Setor resolvido: <span className="font-medium text-foreground">{resolvedSector}</span>
          </p>
        </div>
        {summary && (
          <div className="flex gap-2 text-xs">
            <span className="rounded-md border border-border px-2 py-1 bg-muted/40">
              Core: {coreLabel}
            </span>
            <span className="rounded-md border border-border px-2 py-1 bg-muted/40">
              Optional: {optionalLabel}
            </span>
          </div>
        )}
      </div>

      {summary && (
        <div className="flex flex-wrap gap-2">
          {STATUS_ORDER.map((status) => (
            <span
              key={status}
              className={`inline-flex items-center rounded-md px-2 py-1 text-[11px] font-medium ${STATUS_META[status].className}`}
            >
              {STATUS_META[status].label}: {summary[status]}
            </span>
          ))}
        </div>
      )}
    </section>
  )
}
