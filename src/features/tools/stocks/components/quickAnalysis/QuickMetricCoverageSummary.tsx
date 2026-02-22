import { StockData, QuickMetricStatus } from '@/features/tools/stocks/types/stocks'

interface QuickMetricCoverageSummaryProps {
  data: StockData
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const STATUS_ORDER: QuickMetricStatus[] = [
  'ok',
  'calculated',
  'nao_aplicavel',
  'sem_dado_atual',
  'erro_fonte',
]

const STATUS_META: Record<QuickMetricStatus, { label: string; dot: string; text: string }> = {
  ok: { label: 'Direto', dot: 'bg-emerald-500', text: 'text-emerald-700 dark:text-emerald-400' },
  calculated: { label: 'Calculado', dot: 'bg-sky-500', text: 'text-sky-700 dark:text-sky-400' },
  nao_aplicavel: {
    label: 'N/A',
    dot: 'bg-slate-400 dark:bg-slate-500',
    text: 'text-slate-500 dark:text-slate-400',
  },
  sem_dado_atual: {
    label: 'Sem dado',
    dot: 'bg-amber-500',
    text: 'text-amber-700 dark:text-amber-400',
  },
  erro_fonte: { label: 'Erro fonte', dot: 'bg-rose-500', text: 'text-rose-700 dark:text-rose-400' },
}

type ContextLabel = 'Excelente' | 'Forte' | 'Solido' | 'Neutro' | 'Fragil'
type QualityLabel = 'Robusta' | 'Boa' | 'Moderada' | 'Fraca'

const CONTEXT_LABEL_META: Record<
  ContextLabel,
  { color: string; border: string; bg: string; ring: string }
> = {
  Excelente: {
    color: 'text-emerald-600 dark:text-emerald-400',
    border: 'border-emerald-500/50',
    bg: 'bg-emerald-500/8 dark:bg-emerald-500/10',
    ring: 'bg-emerald-500',
  },
  Forte: {
    color: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-500/50',
    bg: 'bg-blue-500/8 dark:bg-blue-500/10',
    ring: 'bg-blue-500',
  },
  Solido: {
    color: 'text-sky-600 dark:text-sky-400',
    border: 'border-sky-500/50',
    bg: 'bg-sky-500/8 dark:bg-sky-500/10',
    ring: 'bg-sky-500',
  },
  Neutro: {
    color: 'text-amber-600 dark:text-amber-400',
    border: 'border-amber-500/50',
    bg: 'bg-amber-500/8 dark:bg-amber-500/10',
    ring: 'bg-amber-500',
  },
  Fragil: {
    color: 'text-rose-600 dark:text-rose-400',
    border: 'border-rose-500/50',
    bg: 'bg-rose-500/8 dark:bg-rose-500/10',
    ring: 'bg-rose-500',
  },
}

const QUALITY_LABEL_META: Record<
  QualityLabel,
  { color: string; border: string; bg: string; ring: string }
> = {
  Robusta: {
    color: 'text-emerald-600 dark:text-emerald-400',
    border: 'border-emerald-500/50',
    bg: 'bg-emerald-500/8 dark:bg-emerald-500/10',
    ring: 'bg-emerald-500',
  },
  Boa: {
    color: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-500/50',
    bg: 'bg-blue-500/8 dark:bg-blue-500/10',
    ring: 'bg-blue-500',
  },
  Moderada: {
    color: 'text-amber-600 dark:text-amber-400',
    border: 'border-amber-500/50',
    bg: 'bg-amber-500/8 dark:bg-amber-500/10',
    ring: 'bg-amber-500',
  },
  Fraca: {
    color: 'text-rose-600 dark:text-rose-400',
    border: 'border-rose-500/50',
    bg: 'bg-rose-500/8 dark:bg-rose-500/10',
    ring: 'bg-rose-500',
  },
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ScoreRing({ score, ringColor }: { score: number; ringColor: string }) {
  const r = 22
  const circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" className="shrink-0">
      <circle cx="28" cy="28" r={r} fill="none" strokeWidth="4" className="stroke-border" />
      <circle
        cx="28"
        cy="28"
        r={r}
        fill="none"
        strokeWidth="4"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 28 28)"
        className={ringColor.replace('bg-', 'stroke-')}
      />
      <text
        x="28"
        y="32"
        textAnchor="middle"
        className="fill-foreground text-[13px] font-bold"
        style={{ fontSize: 13, fontWeight: 700 }}
      >
        {score}
      </text>
    </svg>
  )
}

function MiniBar({ value, max = 100, color }: { value: number; max?: number; color: string }) {
  const pct = Math.min(100, Math.round((value / max) * 100))
  return (
    <div className="h-1 w-full rounded-full bg-border overflow-hidden">
      <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function QuickMetricCoverageSummary({ data }: QuickMetricCoverageSummaryProps) {
  const summary = data.quickMetricSummary
  const ingestion = data.quickMetricIngestion
  const contextScore = data.sectorContextScore
  const qualityScore = data.dataQualityScore

  if (!summary && !ingestion && !contextScore && !qualityScore) return null

  const resolvedSector = ingestion?.resolvedSector || data.sector || 'Setor não identificado'

  const coreReady = summary?.coreReady ?? 0
  const coreTotal = summary?.coreTotal ?? 0
  const corePct = coreTotal > 0 ? Math.round((coreReady / coreTotal) * 100) : 0

  const contextMeta = contextScore ? CONTEXT_LABEL_META[contextScore.label as ContextLabel] : null
  const qualityMeta = qualityScore ? QUALITY_LABEL_META[qualityScore.label as QualityLabel] : null

  const lowConfidence = (contextScore?.confidence ?? 100) < 50

  return (
    <section className="rounded-xl border border-border bg-card overflow-hidden">
      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 pt-4 pb-3 border-b border-border/60">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="size-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <svg
              viewBox="0 0 16 16"
              fill="none"
              className="size-4 text-primary"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M2 11l3-4 3 2 3-5 3 3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-foreground leading-tight">
              Análise de Cobertura
            </h3>
            <p className="text-[11px] text-muted-foreground mt-0.5 truncate">{resolvedSector}</p>
          </div>
        </div>

        {/* Core coverage pill */}
        {coreTotal > 0 && (
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[11px] text-muted-foreground">Core</span>
            <span
              className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border
              ${
                corePct === 100
                  ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30'
                  : corePct >= 70
                    ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30'
                    : 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30'
              }`}
            >
              {coreReady}/{coreTotal}
            </span>
          </div>
        )}
      </div>

      <div className="p-4 space-y-4">
        {/* ── Status breakdown ───────────────────────────────────── */}
        {summary && (
          <div className="space-y-2">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
              Distribuição das métricas
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-1.5">
              {STATUS_ORDER.filter((s) => summary[s] > 0).map((status) => (
                <div key={status} className="flex items-center gap-1.5">
                  <span className={`size-2 rounded-full shrink-0 ${STATUS_META[status].dot}`} />
                  <span className={`text-[11px] font-medium ${STATUS_META[status].text}`}>
                    {STATUS_META[status].label}
                  </span>
                  <span className="text-[11px] text-muted-foreground font-mono">
                    {summary[status]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Score cards ─────────────────────────────────────────── */}
        {(contextScore || qualityScore) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Score Contextual Setorial */}
            {contextScore && contextMeta && (
              <div
                className={`rounded-lg border p-3 space-y-2.5 transition-opacity
                ${contextMeta.border} ${contextMeta.bg}
                ${lowConfidence ? 'opacity-60' : ''}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                      Score Setorial
                    </p>
                    <p className={`text-lg font-bold leading-none ${contextMeta.color}`}>
                      {contextScore.label}
                    </p>
                  </div>
                  <ScoreRing score={contextScore.score} ringColor={contextMeta.ring} />
                </div>

                <MiniBar value={contextScore.score} color={contextMeta.ring} />

                <div className="grid grid-cols-2 gap-x-3 gap-y-1 pt-0.5">
                  <div>
                    <p className="text-[10px] text-muted-foreground">vs benchmark</p>
                    <p className="text-[12px] font-semibold text-foreground">
                      {contextScore.favorableVsBenchmarkCore}
                      <span className="text-muted-foreground font-normal">
                        /{contextScore.benchmarkComparableCore} favoráveis
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground">Confiança</p>
                    <p
                      className={`text-[12px] font-semibold
                      ${
                        contextScore.confidence < 50
                          ? 'text-amber-600 dark:text-amber-400'
                          : 'text-foreground'
                      }`}
                    >
                      {contextScore.confidence}%
                    </p>
                  </div>
                </div>

                {lowConfidence && (
                  <div className="flex items-center gap-1.5 rounded-md bg-amber-500/10 border border-amber-500/20 px-2 py-1.5">
                    <svg
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      className="size-3 text-amber-500 shrink-0"
                    >
                      <path d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM0 8a8 8 0 1116 0A8 8 0 010 8zm7.25-3.25a.75.75 0 011.5 0v3.5a.75.75 0 01-1.5 0v-3.5zm.75 6.5a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                    <p className="text-[10px] text-amber-700 dark:text-amber-400 leading-tight">
                      Poucos dados comparáveis — score estimado
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Qualidade de Dados */}
            {qualityScore && qualityMeta && (
              <div
                className={`rounded-lg border p-3 space-y-2.5 ${qualityMeta.border} ${qualityMeta.bg}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                      Qualidade de Dados
                    </p>
                    <p className={`text-lg font-bold leading-none ${qualityMeta.color}`}>
                      {qualityScore.label}
                    </p>
                  </div>
                  <ScoreRing score={qualityScore.score} ringColor={qualityMeta.ring} />
                </div>

                <MiniBar value={qualityScore.score} color={qualityMeta.ring} />

                <div className="space-y-1.5 pt-0.5">
                  {[
                    {
                      label: 'Direto da fonte',
                      value: qualityScore.directRate,
                      color: 'bg-emerald-500',
                    },
                    { label: 'Calculado', value: qualityScore.calculatedRate, color: 'bg-sky-500' },
                    { label: 'Em falta', value: qualityScore.missingRate, color: 'bg-amber-500' },
                  ].map(({ label, value, color }) => (
                    <div key={label} className="flex items-center gap-2">
                      <span className="text-[10px] text-muted-foreground w-24 shrink-0">
                        {label}
                      </span>
                      <div className="flex-1 h-1 rounded-full bg-border overflow-hidden">
                        <div
                          className={`h-full rounded-full ${color}`}
                          style={{ width: `${Math.min(100, value)}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-mono text-muted-foreground w-8 text-right shrink-0">
                        {value}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
