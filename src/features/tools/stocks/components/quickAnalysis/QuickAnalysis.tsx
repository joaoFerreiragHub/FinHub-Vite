import { ScoresSummary } from './ScoresSummary'
import { RiskAlert } from './RiskAlert'
import { PerformanceRadarChart } from './PerformanceRadarChart'
import { PeersMiniTable } from './PeersMiniTable'
import { FinHubScore } from './FinHubScore'
import { StockRatingsBySector } from '../StockSectors/StockRatingsBySector'
import { ScoreData, StockData } from '@/features/tools/stocks/types/stocks'
import { mapAlertsToAlertItems } from '../hooks/mapAlertsToAlertItems'
import { mapCompanyDataToScoresSummary } from '../hooks/mapCompanyDataToScoresSummary'
import { QuickMetricCoverageSummary } from './QuickMetricCoverageSummary'
import { QuickMetricGovernanceProvider } from './QuickMetricGovernanceContext'

interface QuickAnalysisProps {
  data: StockData
  onPeerClick?: (symbol: string) => void
}

function normalizeMetricLabel(value: string): string {
  return value
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

const BENCHMARK_ALIASES: Record<string, string[]> = {
  [normalizeMetricLabel('Crescimento Receita')]: ['Crescimento Receita', 'Crescimento da Receita'],
  [normalizeMetricLabel('Margem Liquida')]: ['Margem Liquida'],
  [normalizeMetricLabel('Divida/EBITDA')]: ['Divida/EBITDA', 'Endividamento'],
  [normalizeMetricLabel('Divida / Capitais Proprios')]: [
    'Divida / Capitais Proprios',
    'Divida/Patrimonio',
    'Debt/Equity',
  ],
  [normalizeMetricLabel('P/VPA')]: ['P/VPA', 'P/B'],
}

function isDashLike(value: string | undefined): boolean {
  if (value == null) return true
  const trimmed = value.trim()
  return (
    trimmed === '' ||
    trimmed === '-' ||
    trimmed === '---' ||
    trimmed === '--' ||
    trimmed === 'n/a' ||
    trimmed === 'N/A' ||
    trimmed === '—' ||
    trimmed === 'â€”' ||
    trimmed === 'Ã¢â‚¬â€'
  )
}

function collectComparableLabels(
  metricLabel: string,
  indicadores: Record<string, string>,
): string[] {
  const labels = new Set<string>([metricLabel])

  Object.entries(BENCHMARK_ALIASES).forEach(([key, aliases]) => {
    if (labelsEquivalent(metricLabel, key)) {
      aliases.forEach((alias) => labels.add(alias))
    }
  })

  Object.keys(indicadores)
    .filter((key) => key.endsWith(' (Y-1)'))
    .forEach((y1Key) => {
      const baseLabel = y1Key.replace(/ \(Y-1\)$/, '')
      if (labelsEquivalent(baseLabel, metricLabel)) {
        labels.add(baseLabel)
      }
    })

  return [...labels]
}

function buildBenchmarkAwareIndicadores(data: StockData): Record<string, string> {
  const indicadores = { ...(data.indicadores || {}) }
  const comparisons = data.benchmarkComparisons || {}

  Object.entries(comparisons).forEach(([label, benchmarkValue]) => {
    if (isDashLike(benchmarkValue)) return

    const labelsToApply = collectComparableLabels(label, indicadores)

    labelsToApply.forEach((targetLabel) => {
      const y1Key = `${targetLabel} (Y-1)`
      const previousValue = indicadores[y1Key]

      if (!isDashLike(previousValue) && !indicadores[`${targetLabel} (Ano Anterior)`]) {
        indicadores[`${targetLabel} (Ano Anterior)`] = previousValue
      }

      indicadores[y1Key] = benchmarkValue
    })
  })

  return indicadores
}

function renderBenchmarkHint(data: StockData): string | null {
  const ctx = data.benchmarkContext
  if (!ctx || Object.keys(data.benchmarkComparisons || {}).length === 0) return null

  const asOf = new Date(ctx.asOf).toLocaleDateString('pt-PT')
  const industry = ctx.industry || 'industria da empresa'
  const sourceHint =
    ctx.primarySource === 'fallback'
      ? 'fallback setorial interno'
      : ctx.primarySource === 'mixed'
        ? 'peers/industria + fallback setorial'
        : ctx.yahooFallbackUsed
          ? 'peers + Yahoo Finance'
          : ctx.googleAvailable
            ? 'Google Finance + peers/industria'
            : 'peers + snapshots de industria/setor'

  return `Comparacao "vs." usa benchmark (${industry}, ${sourceHint}, ${asOf}).`
}

export function QuickAnalysis({ data, onPeerClick }: QuickAnalysisProps) {
  const indicadoresForQuick = buildBenchmarkAwareIndicadores(data)
  const benchmarkHint = renderBenchmarkHint(data)

  return (
    <div className="space-y-6">
      <FinHubScore
        score={data.finHubScore}
        label={data.finHubLabel}
        coverage={data.finHubCoverage}
        dataPeriod={data.dataPeriod}
      />

      <ScoresSummary data={mapCompanyDataToScoresSummary(data)} />
      <RiskAlert alerts={mapAlertsToAlertItems(data.alerts)} />

      <div className="flex flex-wrap justify-center items-start">
        <PerformanceRadarChart title={data.symbol} data={data.radarData} />

        {data.radarPeers?.map((peer: { symbol: string; radar: ScoreData[] }) => (
          <PerformanceRadarChart key={peer.symbol} title={peer.symbol} data={peer.radar} />
        ))}
      </div>

      <div className="flex items-center gap-3 pt-1">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
          Indicadores por Categoria
        </span>
        <div className="flex-1 h-px bg-border" />
      </div>

      <QuickMetricCoverageSummary data={data} />

      <QuickMetricGovernanceProvider states={data.quickMetricStates}>
        <StockRatingsBySector setor={data.sector} indicadores={indicadoresForQuick} />
      </QuickMetricGovernanceProvider>
      {benchmarkHint && <p className="text-xs text-muted-foreground -mt-3">{benchmarkHint}</p>}

      {data.peersQuotes?.length > 0 && (
        <PeersMiniTable
          peers={data.peersQuotes.map((peer) => ({
            symbol: peer.symbol,
            name: peer.name,
            price: peer.price,
            change: peer.changesPercentage || 0,
          }))}
          onPeerClick={onPeerClick}
        />
      )}
    </div>
  )
}
