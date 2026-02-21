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
  if (!state) return formatValue(rawValue, key)
  if (state.status === 'nao_aplicavel') return 'N/A'
  if (state.status === 'sem_dado_atual' || state.status === 'erro_fonte') return '-'
  return formatValue(rawValue, key)
}

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
          const numeric = parseFloat(valor)
          const { apenasInformativo } = avaliarIndicadorComContexto(
            setor as Setor,
            label,
            numeric,
            {
              valorAnterior: undefined,
              complementares,
            },
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

                const { score, explicacaoCustom } = avaliarIndicadorComContexto(
                  setor as Setor,
                  label,
                  numeric,
                  {
                    valorAnterior: prev,
                    complementares,
                  },
                )

                const canCompare = !shouldHideCurrentValueByState(governanceState)
                const hasImprovement =
                  canCompare && prev !== undefined && !isNaN(prev) && numeric > prev
                const hasDeterioration =
                  canCompare && prev !== undefined && !isNaN(prev) && numeric < prev

                return (
                  <div
                    key={label}
                    className="rounded-lg border border-border bg-background px-4 py-3 hover:bg-muted/40 transition-colors duration-150"
                  >
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

                      <div className="flex items-center gap-1.5">
                        <IndicatorValuePro
                          score={score}
                          tooltip={
                            explicacaoCustom?.trim()
                              ? explicacaoCustom
                              : `Benchmark definido para "${label}".`
                          }
                        />
                        {stateMeta && (
                          <span
                            className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium ${stateMeta.className}`}
                          >
                            {stateMeta.label}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-end justify-between gap-2">
                      <span className="text-xl font-bold text-foreground tabular-nums leading-none">
                        {getCurrentValueDisplay(valor, chave, formatValue, governanceState)}
                      </span>
                      {anterior && canCompare && (
                        <div className="flex items-center gap-0.5 text-xs text-muted-foreground">
                          <span>vs.</span>
                          <span>{formatValue(anterior, chave)}</span>
                          {hasImprovement && (
                            <span className="text-green-500 font-semibold">^</span>
                          )}
                          {hasDeterioration && (
                            <span className="text-red-500 font-semibold">v</span>
                          )}
                        </div>
                      )}
                    </div>

                    {stateMeta && (
                      <p className="mt-2 text-[10px] text-muted-foreground leading-tight">
                        {stateMeta.hint}
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
