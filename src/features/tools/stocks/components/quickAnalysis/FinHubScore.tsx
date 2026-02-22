import { cn } from '@/lib/utils'

interface FinHubScoreProps {
  score: number | null | undefined
  label: string | null | undefined
  coverage?: number | null
  dataPeriod?: string | null
}

// Thresholds visíveis na barra: Neutro | Sólido | Forte | Excelente
const THRESHOLDS = [
  { value: 40, label: 'Neutro' },
  { value: 55, label: 'Sólido' },
  { value: 70, label: 'Forte' },
  { value: 85, label: 'Excelente' },
]

// Gradiente fixo que cobre toda a escala — clip-path limita ao score actual
const GRADIENT =
  'linear-gradient(to right, #ef4444 0%, #f97316 30%, #eab308 50%, #3b82f6 68%, #22c55e 85%)'

function scoreColor(score: number): string {
  if (score >= 85) return 'text-emerald-600 dark:text-emerald-400'
  if (score >= 70) return 'text-blue-600 dark:text-blue-400'
  if (score >= 55) return 'text-amber-500 dark:text-amber-400'
  if (score >= 40) return 'text-orange-500 dark:text-orange-400'
  return 'text-red-600 dark:text-red-400'
}

export function FinHubScore({ score, label, coverage, dataPeriod }: FinHubScoreProps) {
  if (score == null) return null

  const color = scoreColor(score)

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm space-y-3">
      {/* ── Cabeçalho ── */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold text-muted-foreground">FinHub Score</span>
          {coverage != null && (
            <span className="rounded-md bg-muted/60 px-1.5 py-0.5 text-[10px] text-muted-foreground border border-border">
              {coverage}/4 métricas
            </span>
          )}
          {dataPeriod && (
            <span className="rounded-md bg-muted/60 px-1.5 py-0.5 text-[10px] text-muted-foreground border border-border">
              {dataPeriod}
            </span>
          )}
        </div>

        <div className="flex items-baseline gap-1.5 shrink-0">
          <span className={cn('text-3xl font-bold tabular-nums leading-none', color)}>{score}</span>
          <span className="text-sm text-muted-foreground">/100</span>
          {label && <span className={cn('text-sm font-semibold ml-1', color)}>· {label}</span>}
        </div>
      </div>

      {/* ── Barra gradient com thresholds ── */}
      <div className="space-y-1.5">
        <div className="relative h-4 w-full rounded-full bg-muted overflow-hidden">
          {/* Preenchimento gradient — clip-path recorta até ao score */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: GRADIENT,
              clipPath: `inset(0 ${100 - score}% 0 0 round 9999px)`,
            }}
          />
          {/* Tick marks nos thresholds */}
          {THRESHOLDS.map(({ value }) => (
            <div
              key={value}
              className="absolute top-0 bottom-0 w-px bg-background/50 z-10"
              style={{ left: `${value}%` }}
            />
          ))}
          {/* Indicador de posição actual */}
          <div
            className="absolute top-1/2 -translate-y-1/2 z-20 size-3 rounded-full bg-white shadow-md ring-2 ring-background"
            style={{ left: `calc(${Math.min(98, Math.max(2, score))}% - 6px)` }}
          />
        </div>

        {/* Etiquetas dos thresholds */}
        <div className="relative h-4 w-full select-none">
          {THRESHOLDS.map(({ value, label: tlabel }) => (
            <span
              key={value}
              className="absolute text-[9px] text-muted-foreground/60 -translate-x-1/2 leading-none"
              style={{ left: `${value}%` }}
            >
              {tlabel}
            </span>
          ))}
        </div>
      </div>

      {/* ── Descrição ── */}
      <p className="text-xs text-muted-foreground leading-relaxed">
        Combinação de <span className="font-medium text-foreground">Qualidade</span>,{' '}
        <span className="font-medium text-foreground">Crescimento</span>,{' '}
        <span className="font-medium text-foreground">Valuation</span> e{' '}
        <span className="font-medium text-foreground">Risco</span> — avaliados no contexto setorial.
      </p>
    </div>
  )
}
