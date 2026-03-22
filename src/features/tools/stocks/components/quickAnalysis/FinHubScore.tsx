import { cn } from '@/lib/utils'
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from 'recharts'

interface FinHubScoreBreakdown {
  qualityScore?: number | null
  growthScore?: number | null
  valuationGrade?: string | null
  riskScore?: number | null
}

interface FinHubScoreProps {
  score: number | null | undefined
  label: string | null | undefined
  coverage?: number | null
  dataPeriod?: string | null
  breakdown?: FinHubScoreBreakdown
}

const THRESHOLDS = [
  { value: 40, label: 'Neutro' },
  { value: 55, label: 'Solido' },
  { value: 70, label: 'Forte' },
  { value: 85, label: 'Excelente' },
]

const GRADIENT =
  'linear-gradient(to right, #ef4444 0%, #f97316 30%, #eab308 50%, #3b82f6 68%, #22c55e 85%)'

const VALUATION_GRADE_MAP: Record<string, number> = {
  A: 90,
  B: 75,
  C: 60,
  D: 40,
  F: 20,
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function scoreColor(score: number): string {
  if (score >= 85) return 'text-emerald-600 dark:text-emerald-400'
  if (score >= 70) return 'text-blue-600 dark:text-blue-400'
  if (score >= 55) return 'text-amber-500 dark:text-amber-400'
  if (score >= 40) return 'text-orange-500 dark:text-orange-400'
  return 'text-red-600 dark:text-red-400'
}

function scoreBg(score: number): string {
  if (score >= 70) return 'bg-emerald-500/5 dark:bg-emerald-950/20'
  if (score >= 40) return ''
  return 'bg-red-500/5 dark:bg-red-950/20'
}

function toPercentFromTen(value: number | null | undefined): number | null {
  if (typeof value !== 'number' || Number.isNaN(value)) return null
  return Math.round(clamp(value, 0, 10) * 10)
}

function toValuationPercent(grade: string | null | undefined): number | null {
  if (!grade || typeof grade !== 'string') return null
  const normalized = grade.trim().toUpperCase()
  return VALUATION_GRADE_MAP[normalized] ?? null
}

function getStars(score: number): number {
  return clamp(Math.round(score / 20), 1, 5)
}

function buildSnowflakeData(
  breakdown?: FinHubScoreBreakdown,
): Array<{ metric: string; value: number }> | null {
  if (!breakdown) return null

  const quality = toPercentFromTen(breakdown.qualityScore)
  const growth = toPercentFromTen(breakdown.growthScore)
  const valuation = toValuationPercent(breakdown.valuationGrade)
  const risk = toPercentFromTen(breakdown.riskScore)

  if (quality == null || growth == null || valuation == null || risk == null) {
    return null
  }

  return [
    { metric: 'Qualidade', value: quality },
    { metric: 'Crescimento', value: growth },
    { metric: 'Valuation', value: valuation },
    { metric: 'Risco', value: risk },
  ]
}

export function FinHubScore({ score, label, coverage, dataPeriod, breakdown }: FinHubScoreProps) {
  if (score == null) return null

  const normalizedScore = Math.round(clamp(score, 0, 100))
  const color = scoreColor(normalizedScore)
  const stars = getStars(normalizedScore)
  const snowflakeData = buildSnowflakeData(breakdown)
  const strengths = snowflakeData?.filter((item) => item.value >= 70).length ?? 0
  const attention = snowflakeData?.filter((item) => item.value <= 40).length ?? 0

  return (
    <div
      className={cn(
        'rounded-2xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md md:p-6',
        scoreBg(normalizedScore),
      )}
    >
      <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr] lg:items-stretch">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              FinHub Score
            </span>
            {coverage != null && (
              <span className="rounded-md border border-border bg-muted/60 px-2 py-0.5 text-[10px] text-muted-foreground">
                {coverage}/4 metricas
              </span>
            )}
            {dataPeriod && (
              <span className="rounded-md border border-border bg-muted/60 px-2 py-0.5 text-[10px] text-muted-foreground">
                {dataPeriod}
              </span>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-end gap-2">
              <span
                className={cn(
                  'text-5xl font-extrabold leading-none tabular-nums tracking-tight',
                  color,
                )}
              >
                {normalizedScore}
              </span>
              <span className="pb-1 text-base text-muted-foreground">/100</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {label ? (
                <span
                  className={cn(
                    'rounded-md border border-current/25 px-2 py-0.5 text-sm font-semibold',
                    color,
                  )}
                >
                  {label}
                </span>
              ) : null}

              <span className="text-xs font-medium text-muted-foreground tabular-nums">
                rating {stars}/5
              </span>
            </div>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">
            Sintese de <span className="font-medium text-foreground">Qualidade</span>,{' '}
            <span className="font-medium text-foreground">Crescimento</span>,{' '}
            <span className="font-medium text-foreground">Valuation</span> e{' '}
            <span className="font-medium text-foreground">Risco</span>, com leitura no contexto
            setorial.
          </p>

          {snowflakeData ? (
            <p className="text-xs text-muted-foreground">
              {strengths} dimensoes fortes e {attention} em atencao no snowflake.
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">
              Snowflake indisponivel por falta de dados.
            </p>
          )}
        </div>

        <div className="rounded-xl border border-border/60 bg-background/70 p-3">
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              Radar Snowflake
            </p>
            {snowflakeData ? (
              <span className="text-[11px] text-muted-foreground tabular-nums">
                {strengths} fortes
              </span>
            ) : null}
          </div>

          {snowflakeData ? (
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={snowflakeData} outerRadius="70%">
                  <defs>
                    <radialGradient id="finhub-snowflake-fill" cx="50%" cy="50%" r="60%">
                      <stop offset="0%" stopColor="#60a5fa" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.18} />
                    </radialGradient>
                  </defs>
                  <PolarGrid stroke="rgba(148,163,184,0.35)" />
                  <PolarAngleAxis
                    dataKey="metric"
                    tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <PolarRadiusAxis domain={[0, 100]} axisLine={false} tick={false} />
                  <Radar
                    dataKey="value"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fill="url(#finhub-snowflake-fill)"
                    fillOpacity={0.9}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-xs text-muted-foreground">
              Dados insuficientes para radar.
            </div>
          )}
        </div>
      </div>

      <div className="mt-5 space-y-1.5">
        <div className="relative h-4 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: GRADIENT,
              clipPath: `inset(0 ${100 - normalizedScore}% 0 0 round 9999px)`,
            }}
          />
          {THRESHOLDS.map(({ value }) => (
            <div
              key={value}
              className="absolute top-0 bottom-0 z-10 w-px bg-background/60"
              style={{ left: `${value}%` }}
            />
          ))}
          <div
            className="absolute top-1/2 z-20 size-3 -translate-y-1/2 rounded-full bg-background shadow-md ring-2 ring-border"
            style={{ left: `calc(${Math.min(98, Math.max(2, normalizedScore))}% - 6px)` }}
          />
        </div>

        <div className="relative h-4 w-full select-none">
          {THRESHOLDS.map(({ value, label: thresholdLabel }) => (
            <span
              key={value}
              className="absolute -translate-x-1/2 text-[9px] leading-none text-muted-foreground/60"
              style={{ left: `${value}%` }}
            >
              {thresholdLabel}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
