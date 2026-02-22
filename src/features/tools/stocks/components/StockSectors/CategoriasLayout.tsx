import { useMemo } from 'react'
import { QuickMetricState } from '@/features/tools/stocks/types/stocks'
import { avaliarIndicadorComContexto } from '../hooks/avaliarIndicadorComContexto'
import { Setor } from './thresholds'
import { useQuickMetricGovernance } from '../quickAnalysis/QuickMetricGovernanceContext'
import { IndicatorValuePro } from '../quickAnalysis/IndicatorValuePro'

export interface RawIndicador {
  label: string
  chave: string
  valor: string
  anterior?: string
  icon?: string
  description?: string
}

interface CategoriasLayoutProps {
  categorias: Record<string, RawIndicador[]>
  setor: string
  formatValue: (valor: string, chave: string) => string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  complementares?: Record<string, any>
}

const DASH_VALUES = new Set(['—', '-', '--', 'N/A', ''])

// Métricas onde um valor mais baixo é melhor (PE, dívida, beta, etc.)
const LOWER_IS_BETTER_NORM = new Set([
  'p l',
  'p s',
  'peg',
  'divida ebitda',
  'endividamento',
  'divida capitais proprios',
  'divida patrimonio',
  'debt equity',
  'divida total patrimonio',
  'beta',
  'capex receita',
  'sga receita',
])

function normForComparison(label: string): string {
  return String(label || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9 ]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
}

function isLowerBetterLabel(label: string): boolean {
  return LOWER_IS_BETTER_NORM.has(normForComparison(label))
}

const CATALOG_LABELS = new Set(
  [
    'Crescimento Receita',
    'Crescimento da Receita',
    'CAGR EPS',
    'EPS',
    'Margem Bruta',
    'Margem EBITDA',
    'Margem Liquida',
    'Margem Operacional',
    'ROIC',
    'ROE',
    'P/L',
    'P/S',
    'PEG',
    'Divida/EBITDA',
    'Endividamento',
    'Liquidez Corrente',
    'Divida / Capitais Proprios',
    'Divida/Patrimonio',
    'Debt/Equity',
    'Divida Total/Patrimonio',
    'Cash Ratio',
    'Beta',
  ].map((l) => l.toLowerCase()),
)

function isCatalogMetric(label: string): boolean {
  const norm = normalizeMetricLabel(label)
  if (CATALOG_LABELS.has(norm)) return true
  return GOVERNANCE_ALIAS_GROUPS.some((aliases) =>
    aliases.some((alias) => normalizeMetricLabel(alias) === norm),
  )
}

const GOVERNANCE_ALIAS_GROUPS: string[][] = [
  ['Crescimento Receita', 'Crescimento da Receita'],
  ['CAGR EPS'],
  ['EPS'],
  ['Margem Bruta'],
  ['Margem EBITDA'],
  ['Margem Liquida'],
  ['Margem Operacional'],
  ['ROIC'],
  ['ROE'],
  ['P/L'],
  ['P/S'],
  ['PEG'],
  ['Divida/EBITDA', 'Endividamento'],
  ['Liquidez Corrente'],
  ['Divida / Capitais Proprios', 'Divida/Patrimonio', 'Debt/Equity', 'Divida Total/Patrimonio'],
  ['Cash Ratio'],
  ['Beta'],
]

function normalizeMetricLabel(value: string): string {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\x20-\x7E]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .trim()
    .toLowerCase()
}

function compactMetricLabel(value: string): string {
  return normalizeMetricLabel(value)
    .replace(/\b(de|da|do|das|dos|the|of|and)\b/g, '')
    .replace(/[aeiou]/g, '')
    .replace(/\s+/g, '')
}

function labelsEquivalent(a: string, b: string): boolean {
  const normalizedA = normalizeMetricLabel(a)
  const normalizedB = normalizeMetricLabel(b)
  if (normalizedA === normalizedB) return true

  const compactA = compactMetricLabel(a)
  const compactB = compactMetricLabel(b)
  if (!compactA || !compactB) return false

  return compactA === compactB || compactA.includes(compactB) || compactB.includes(compactA)
}

function buildCandidateLabels(label: string): string[] {
  const candidates = new Set<string>([label])
  GOVERNANCE_ALIAS_GROUPS.forEach((aliases) => {
    if (aliases.some((alias) => labelsEquivalent(alias, label))) {
      aliases.forEach((alias) => candidates.add(alias))
    }
  })
  return [...candidates]
}

function resolveGovernanceState(
  label: string,
  stateEntries: Array<[string, QuickMetricState]>,
): QuickMetricState | null {
  if (!stateEntries.length) return null
  if (!isCatalogMetric(label)) return null

  const candidates = buildCandidateLabels(label)
  for (const candidate of candidates) {
    const direct = stateEntries.find(([stateLabel]) => labelsEquivalent(stateLabel, candidate))
    if (direct) return direct[1]
  }

  return null
}

function getStateMeta(state: QuickMetricState) {
  switch (state.status) {
    case 'ok':
      return {
        label: 'Direto',
        className:
          'bg-emerald-500/10 text-emerald-700 border border-emerald-500/30 dark:text-emerald-300',
        hint: state.source ? `Direto da fonte (${state.source}).` : 'Direto da fonte.',
      }
    case 'calculated':
      return {
        label: 'Calculado',
        className: 'bg-sky-500/10 text-sky-700 border border-sky-500/30 dark:text-sky-300',
        hint: state.reason?.startsWith('formula:')
          ? `Calculado por formula (${state.reason.replace('formula:', '')}).`
          : state.source
            ? `Calculado (${state.source}).`
            : 'Calculado por fallback/formula.',
      }
    case 'nao_aplicavel':
      return {
        label: 'Nao aplicavel',
        className: 'bg-slate-500/10 text-slate-700 border border-slate-500/30 dark:text-slate-300',
        hint: 'Metrica nao aplicavel para este setor.',
      }
    case 'sem_dado_atual':
      return {
        label: 'Sem dado atual',
        className: 'bg-amber-500/10 text-amber-700 border border-amber-500/30 dark:text-amber-300',
        hint: 'Sem valor atual no periodo da metrica.',
      }
    case 'erro_fonte':
      return {
        label: 'Erro fonte',
        className: 'bg-rose-500/10 text-rose-700 border border-rose-500/30 dark:text-rose-300',
        hint: 'Falha tecnica ao obter dado da fonte.',
      }
    default:
      return null
  }
}

function shouldHideCurrentValueByState(state: QuickMetricState | null): boolean {
  if (!state) return false
  return (
    state.status === 'nao_aplicavel' ||
    state.status === 'sem_dado_atual' ||
    state.status === 'erro_fonte'
  )
}

function getCurrentValueDisplay(
  rawValue: string,
  key: string,
  formatValue: (valor: string, chave: string) => string,
  state: QuickMetricState | null,
): string {
  if (state?.status === 'nao_aplicavel') return 'N/A'
  if (state?.status === 'sem_dado_atual' || state?.status === 'erro_fonte') return '—'
  if (!state && DASH_VALUES.has(rawValue)) return '—'
  return formatValue(rawValue, key)
}

// ─── Sub-componentes visuais ──────────────────────────────────────────────────

/** Seta SVG com percentagem de variação YoY.
 *  Verde = valor subiu, vermelho = valor desceu — convenção universal de mercado.
 *  A avaliação de "bom/mau" é feita pelo badge de score e pela barra de benchmark. */
function TrendArrow({ current, prev }: { current: number; prev: number; label: string }) {
  if (isNaN(current) || isNaN(prev) || prev === 0) return null

  const changePct = ((current - prev) / Math.abs(prev)) * 100
  if (!isFinite(changePct)) return null

  const wentUp = current > prev

  const absChange = Math.abs(changePct)
  const formatted = absChange >= 10 ? `${Math.round(absChange)}%` : `${absChange.toFixed(1)}%`

  const colorClass = wentUp
    ? 'text-emerald-600 dark:text-emerald-400'
    : 'text-red-500 dark:text-red-400'

  return (
    <div
      className={`flex items-center gap-0.5 text-[11px] font-semibold tabular-nums ${colorClass}`}
    >
      {wentUp ? (
        <svg viewBox="0 0 8 8" className="size-2.5 shrink-0" fill="currentColor">
          <path d="M4 1L7.5 6.5H.5L4 1Z" />
        </svg>
      ) : (
        <svg viewBox="0 0 8 8" className="size-2.5 shrink-0" fill="currentColor">
          <path d="M4 7L.5 1.5H7.5L4 7Z" />
        </svg>
      )}
      {formatted}
    </div>
  )
}

/** Barra de posição vs benchmark setorial */
function BenchmarkBar({
  current,
  benchmarkRaw,
  label,
}: {
  current: number
  benchmarkRaw: string | null | undefined
  label: string
}) {
  if (!benchmarkRaw) return null

  const benchmark = parseFloat(benchmarkRaw.replace(/[%,$]/g, '').replace(',', '.').trim())
  if (!isFinite(benchmark) || benchmark === 0 || !isFinite(current)) return null

  const lowerBetter = isLowerBetterLabel(label)

  // ratio > 1 = melhor que benchmark, < 1 = pior
  const ratio = lowerBetter ? benchmark / current : current / benchmark

  // Mapeia ratio para posição 0-100%, benchmark = 50%
  const position = Math.min(97, Math.max(3, 50 + (ratio - 1) * 40))
  const isFavorable = position >= 50

  const dotColor = isFavorable ? 'bg-emerald-500 dark:bg-emerald-400' : 'bg-red-500 dark:bg-red-400'

  return (
    <div className="mt-2 space-y-1">
      <div className="relative h-1 w-full rounded-full bg-border">
        {/* Linha de benchmark no centro */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-px h-3 bg-muted-foreground/40 rounded-full"
          style={{ left: '50%' }}
        />
        {/* Dot de posição actual */}
        <div
          className={`absolute top-1/2 -translate-y-1/2 size-2.5 rounded-full border-2 border-background shadow-sm ${dotColor}`}
          style={{ left: `calc(${position}% - 5px)` }}
        />
      </div>
      <div className="flex justify-between text-[9px] text-muted-foreground/60 leading-none select-none">
        <span>{lowerBetter ? 'Melhor' : 'Abaixo'}</span>
        <span>Benchmark</span>
        <span>{lowerBetter ? 'Pior' : 'Acima'}</span>
      </div>
    </div>
  )
}

// ─── Componente principal ─────────────────────────────────────────────────────

export function CategoriasLayout({
  categorias,
  setor,
  formatValue,
  complementares = {},
}: CategoriasLayoutProps) {
  const governance = useQuickMetricGovernance()
  const stateEntries = useMemo(() => Object.entries(governance?.states || {}), [governance?.states])

  return (
    <div className="space-y-4">
      {Object.entries(categorias).map(([categoria, indicadores]) => {
        const indicadoresValidos = indicadores.filter(({ label, valor }) => {
          if (DASH_VALUES.has(valor)) return true
          const numeric = parseFloat(valor)
          const { apenasInformativo } = avaliarIndicadorComContexto(
            setor as Setor,
            label,
            numeric,
            { valorAnterior: undefined, complementares },
          )
          return !apenasInformativo
        })

        if (indicadoresValidos.length === 0) return null

        return (
          <div key={categoria} className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-3 border-b border-border bg-muted/30">
              <span className="w-1.5 h-5 rounded-full bg-primary shrink-0" />
              <h3 className="text-sm font-semibold text-foreground">{categoria}</h3>
              <span className="text-xs text-muted-foreground">
                ({indicadoresValidos.length} indicador
                {indicadoresValidos.length !== 1 ? 'es' : ''})
              </span>
            </div>

            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {indicadoresValidos.map(({ label, valor, anterior, icon, description, chave }) => {
                const numeric = parseFloat(valor)
                const prev = anterior ? parseFloat(anterior) : undefined
                const governanceState = resolveGovernanceState(label, stateEntries)
                const stateMeta = governanceState ? getStateMeta(governanceState) : null

                const isMissingData = !governanceState && DASH_VALUES.has(valor)
                const missingMeta = isMissingData
                  ? {
                      label: 'Sem dado',
                      className:
                        'bg-amber-500/10 text-amber-700 border border-amber-500/30 dark:text-amber-300',
                      hint: 'Dado não disponível para este ticker.',
                    }
                  : null
                const effectiveStateMeta = stateMeta ?? missingMeta

                const { score, explicacaoCustom } = avaliarIndicadorComContexto(
                  setor as Setor,
                  label,
                  numeric,
                  { valorAnterior: prev, complementares },
                )

                const canCompare = !isMissingData && !shouldHideCurrentValueByState(governanceState)
                const showTrend =
                  canCompare &&
                  prev !== undefined &&
                  !isNaN(prev) &&
                  !isNaN(numeric) &&
                  prev !== numeric

                // Benchmark bar: só se tiver valor numérico válido e benchmark disponível
                const hasBenchmark =
                  !isMissingData &&
                  !shouldHideCurrentValueByState(governanceState) &&
                  governanceState?.benchmarkValue != null &&
                  !isNaN(numeric)

                return (
                  <div
                    key={label}
                    className="rounded-lg border border-border bg-background px-4 py-3 hover:bg-muted/40 transition-colors duration-150"
                  >
                    {/* ── Header: icon + label + badges ── */}
                    <div className="flex items-start justify-between mb-2.5">
                      <div className="flex items-center gap-2 min-w-0">
                        {icon && <span className="text-base shrink-0">{icon}</span>}
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-foreground truncate">{label}</p>
                          {description && (
                            <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">
                              {description}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 ml-2">
                        {!isMissingData && (
                          <IndicatorValuePro
                            score={score}
                            tooltip={
                              explicacaoCustom?.trim()
                                ? explicacaoCustom
                                : `Benchmark definido para "${label}".`
                            }
                          />
                        )}
                        {effectiveStateMeta && (
                          <span
                            className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium ${effectiveStateMeta.className}`}
                          >
                            {effectiveStateMeta.label}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* ── Valor + Seta YoY ── */}
                    <div className="flex items-end justify-between gap-2">
                      <span className="text-xl font-bold text-foreground tabular-nums leading-none">
                        {getCurrentValueDisplay(valor, chave, formatValue, governanceState)}
                      </span>

                      {showTrend && prev !== undefined && (
                        <div className="flex flex-col items-end gap-0.5 pb-0.5">
                          <TrendArrow current={numeric} prev={prev} label={label} />
                          <span className="text-[9px] text-muted-foreground/70 leading-none">
                            vs {formatValue(anterior!, chave)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* ── Barra de posição vs benchmark ── */}
                    {hasBenchmark && (
                      <BenchmarkBar
                        current={numeric}
                        benchmarkRaw={governanceState?.benchmarkValue}
                        label={label}
                      />
                    )}

                    {/* ── Hint de governance ── */}
                    {effectiveStateMeta && !hasBenchmark && (
                      <p className="mt-2 text-[10px] text-muted-foreground leading-tight">
                        {effectiveStateMeta.hint}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
