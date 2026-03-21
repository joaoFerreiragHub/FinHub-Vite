import type { CSSProperties } from 'react'

type Primitive = string | number | null | undefined

type TooltipEntry = {
  dataKey?: string | number
  name?: string | number
  value?: Primitive
  color?: string
  payload?: Record<string, unknown>
}

interface ChartTooltipProps {
  active?: boolean
  payload?: TooltipEntry[]
  label?: Primitive
  dataset?: Array<Record<string, unknown>>
  xDataKey?: string
  deltaDataKey?: string
  deltaLabel?: string
  labelFormatter?: (label: Primitive) => string
  valueFormatter?: (value: number, dataKey?: string | number) => string
  deltaFormatter?: (delta: number) => string
  valueLabel?: string
}

function toFiniteNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value)
    if (Number.isFinite(parsed)) return parsed
  }
  return null
}

function defaultLabelFormatter(label: Primitive): string {
  if (label === null || label === undefined || label === '') return 'Sem periodo'
  return String(label)
}

function defaultValueFormatter(value: number): string {
  return value.toLocaleString('pt-PT')
}

function defaultDeltaFormatter(delta: number): string {
  const sign = delta > 0 ? '+' : ''
  return `${sign}${delta.toFixed(2)}`
}

function resolveToneClass(delta: number): string {
  if (delta > 0) return 'text-market-bull'
  if (delta < 0) return 'text-market-bear'
  return 'text-muted-foreground'
}

export function ChartTooltip({
  active,
  payload,
  label,
  dataset,
  xDataKey,
  deltaDataKey,
  deltaLabel = 'Variacao',
  labelFormatter,
  valueFormatter,
  deltaFormatter,
  valueLabel,
}: ChartTooltipProps) {
  if (!active || !payload?.length) return null

  const currentPoint = payload[0]?.payload
  const formattedLabel = (labelFormatter ?? defaultLabelFormatter)(label)

  const deltaKeyCandidate =
    deltaDataKey ?? (typeof payload[0]?.dataKey === 'string' ? payload[0].dataKey : undefined)

  let delta: number | null = null
  if (dataset && currentPoint && deltaKeyCandidate && xDataKey) {
    const currentX = currentPoint[xDataKey]
    const currentIndex = dataset.findIndex((item) => item[xDataKey] === currentX)
    if (currentIndex > 0) {
      const currentValue = toFiniteNumber(dataset[currentIndex]?.[deltaKeyCandidate])
      const previousValue = toFiniteNumber(dataset[currentIndex - 1]?.[deltaKeyCandidate])
      if (currentValue !== null && previousValue !== null) {
        delta = currentValue - previousValue
      }
    }
  }

  return (
    <div className="min-w-[180px] rounded-lg border border-border/60 bg-card/95 p-3 shadow-lg backdrop-blur-sm">
      <p className="text-xs text-muted-foreground">{formattedLabel}</p>

      <div className="mt-2 space-y-1.5">
        {payload.map((entry, index) => {
          const rawValue = entry.value
          const numericValue = toFiniteNumber(rawValue)
          const formattedValue =
            numericValue === null
              ? String(rawValue ?? 'n/a')
              : (valueFormatter ?? defaultValueFormatter)(numericValue, entry.dataKey)

          const markerStyle: CSSProperties = {
            backgroundColor: entry.color ?? 'hsl(var(--muted-foreground))',
          }

          return (
            <div
              key={`${String(entry.dataKey ?? entry.name ?? 'series')}-${index}`}
              className="flex items-center justify-between gap-4 text-xs"
            >
              <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                <span className="h-2 w-2 rounded-full" style={markerStyle} aria-hidden />
                {String(entry.name ?? entry.dataKey ?? valueLabel ?? 'Valor')}
              </span>
              <span className="tabular-nums font-medium text-foreground">{formattedValue}</span>
            </div>
          )
        })}
      </div>

      {delta !== null ? (
        <div className="mt-2 border-t border-border/60 pt-2 text-xs">
          <span className="text-muted-foreground">{deltaLabel}: </span>
          <span className={`tabular-nums font-semibold ${resolveToneClass(delta)}`}>
            {(deltaFormatter ?? defaultDeltaFormatter)(delta)}
          </span>
        </div>
      ) : null}
    </div>
  )
}
