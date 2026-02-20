import { useState } from 'react'
import { AlertCircle, Info, LandPlot, Loader2, Minus, TrendingDown, TrendingUp } from 'lucide-react'
import {
  Badge,
  Button,
  Card,
  CardContent,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { MarketsNav } from '@/features/markets/components/MarketsNav'
import { fetchReitsToolkit } from '@/features/markets/services/marketToolsApi'

type Frequency = 'Mensal' | 'Trimestral' | 'Semestral' | 'Anual'
type NavScenario = 'optimistic' | 'base' | 'conservative'
type FfoView = 'narait' | 'simplified' | 'cfop' | 'affo'

function toNum(value: number | string | null | undefined): number | null {
  if (value === null || value === undefined || value === '') return null
  const n = typeof value === 'number' ? value : Number.parseFloat(String(value))
  return Number.isNaN(n) ? null : n
}

function fmt(value: number | string | null | undefined, decimals = 2, suffix = ''): string {
  const n = toNum(value)
  if (n === null) return '\u2014'
  return `${n.toFixed(decimals)}${suffix}`
}

function fmtLarge(value: number | string | null | undefined): string {
  const n = toNum(value)
  if (n === null) return '\u2014'
  const abs = Math.abs(n)
  if (abs >= 1e9) return `$${(n / 1e9).toFixed(2)}B`
  if (abs >= 1e6) return `$${(n / 1e6).toFixed(2)}M`
  return `$${n.toFixed(2)}`
}

// ── Tooltip de informação ────────────────────────────────────────────────────

function InfoTip({ text }: { text: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button type="button" className="inline-flex shrink-0 items-center focus:outline-none">
          <Info className="h-3 w-3 text-muted-foreground/35 transition-colors hover:text-muted-foreground/70" />
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-64 whitespace-normal text-xs leading-relaxed">
        {text}
      </TooltipContent>
    </Tooltip>
  )
}

// ── Badge de confiança por bloco ─────────────────────────────────────────────

function ConfidenceBadge({ level }: { level: 'high' | 'medium' | 'low' | undefined }) {
  if (!level) return null
  const config = {
    high: { label: 'Alta conf.', cls: 'border-emerald-500/40 text-emerald-400' },
    medium: { label: 'Media conf.', cls: 'border-amber-500/40 text-amber-400' },
    low: { label: 'Baixa conf.', cls: 'border-red-500/40 text-red-400' },
  }
  const c = config[level]
  return (
    <Badge variant="outline" className={`text-[9px] ${c.cls}`}>
      {c.label}
    </Badge>
  )
}

// ── Linha de métrica ─────────────────────────────────────────────────────────

function MetricRow({
  label,
  value,
  info,
  highlight,
  barValue,
}: {
  label: string
  value: string
  info?: string
  highlight?: 'positive' | 'negative' | 'neutral'
  barValue?: number // 0-100, quando presente exibe progress bar
}) {
  const colorClass =
    highlight === 'positive'
      ? 'text-emerald-400'
      : highlight === 'negative'
        ? 'text-red-400'
        : 'text-foreground'

  const barColor =
    barValue !== undefined
      ? barValue > 90
        ? 'bg-red-400'
        : barValue > 70
          ? 'bg-amber-400'
          : 'bg-emerald-500'
      : ''

  return (
    <div className="group">
      <div className="flex items-center justify-between gap-3 rounded-sm px-1 py-1.5 transition-colors group-hover:bg-muted/25">
        <div className="flex min-w-0 items-center gap-1.5">
          <span className="truncate text-sm text-muted-foreground">{label}</span>
          {info && <InfoTip text={info} />}
        </div>
        <span className={`shrink-0 text-sm font-semibold tabular-nums ${colorClass}`}>{value}</span>
      </div>
      {barValue !== undefined && (
        <div className="mx-1 mb-1 h-0.5 overflow-hidden rounded-full bg-muted/50">
          <div
            className={`h-full rounded-full transition-all duration-500 ${barColor}`}
            style={{ width: `${Math.min(barValue, 100)}%` }}
          />
        </div>
      )}
    </div>
  )
}

// ── Separador interno ────────────────────────────────────────────────────────

function Divider() {
  return <div className="my-1 border-b border-border/30" />
}

// ── Sugestões rápidas ────────────────────────────────────────────────────────

const POPULAR_REITS = [
  { ticker: 'O', label: 'Realty Income' },
  { ticker: 'PLD', label: 'Prologis' },
  { ticker: 'SPG', label: 'Simon Property' },
  { ticker: 'WELL', label: 'Welltower' },
  { ticker: 'VNQ', label: 'Vanguard REIT ETF' },
]

// ── Textos dos tooltips ──────────────────────────────────────────────────────

const INFO = {
  precoAtual: 'Preco de mercado atual por acao.',
  valorIntrinseco:
    'Valor justo estimado pelo Modelo Gordon Growth (DDM): V = D₁ / (r − g), onde D₁ e o dividendo esperado, r o retorno exigido (CAPM) e g a taxa de crescimento historico dos dividendos.',
  diferenca:
    'Diferenca percentual entre o preco de mercado e o valor intrinseco. Negativo = potencialmente subvalorizado; positivo = potencialmente sobrevalorizado.',
  dividendoAnual:
    'Soma de todos os dividendos pagos por acao nos ultimos 12 meses (historico real de distribuicoes).',
  dividendYield: 'Dividendo anual / Preco atual. REITs tipicamente distribuem entre 3% e 7%.',
  dividendCagr:
    'Taxa de Crescimento Anual Composta do dividendo nos ultimos 5 anos. Indica a capacidade historica do REIT de aumentar distribuicoes.',
  retornoExigido:
    'Retorno minimo exigido calculado pelo CAPM: Rf (4.5%) + β × Premio de Risco (5%). Representa o custo de oportunidade do capital.',
  ffoAcao:
    'Funds From Operations por acao — principal metrica de rentabilidade para REITs (NAREIT). FFO = Lucro Liquido + Depreciacao & Amortizacao. Exclui o impacto da depreciacao contabilistica de imoveis, que tendem a valorizar.',
  pFFO: 'Preco / FFO por acao. Equivalente ao P/L para REITs. 12x–20x e considerado razoavel; acima de 30x pode indicar sobrevalorizacao.',
  cashFlowOp:
    'Cash Flow Operacional por acao. Caixa gerado pelas operacoes antes de investimentos. Serve como referencia complementar ao FFO. Nota: o FMP nao disponibiliza capex de manutencao separado para REITs, pelo que o AFFO nao e calculado.',
  payoutRatio:
    'Percentagem do FFO distribuida como dividendos. Intervalo saudavel: 70%–85%. Acima de 90% pode sinalizar risco de corte; abaixo de 60% indica margem de seguranca elevada.',
  debtEbitda:
    'Divida Total / EBITDA. Mede a alavancagem. Abaixo de 6x e considerado conservador para REITs; acima de 7x pode indicar risco financeiro.',
  debtEquity: 'Divida Total / Capital Proprio. Valores tipicos para REITs: 0.5x–1.5x.',
  navAcao:
    'NAV contabilistico por acao = (Ativos Totais − Passivos Totais) / N.º de acoes. IMPORTANTE: este e o book NAV (balanço GAAP), nao o NAV economico. O NAV economico — usado por analistas especializados — avalia os imoveis a valor de mercado via cap rates e NOI, e geralmente superior ao book NAV porque o GAAP nao reavalia ativos ao justo valor.',
  precoNAV:
    'Preco / book NAV por acao. Acima de 1x = premium (mercado valoriza acima do valor contabilistico); abaixo de 1x = discount. Nota: comparar com o NAV economico (cap rate / NOI) daria um racio mais preciso, mas requer dados que o FMP nao disponibiliza no plano atual.',
  premiumDiscount:
    'Desvio percentual do preco em relacao ao book NAV. Um discount nao e necessariamente uma oportunidade — pode refletir alavancagem excessiva, qualidade fraca dos ativos, risco de diluicao ou pressao de subida das taxas. Um premium pode indicar qualidade e crescimento... ou sobrevalorizacao. Analisa sempre em conjunto com Divida/EBITDA, Payout Ratio e qualidade do portfolio.',
  navTotal:
    'Book NAV total = Ativos Totais − Passivos Totais do balanco mais recente (valor contabilistico, nao economico).',
  marketCap:
    'Capitalizacao de mercado. Comparar com NAV total permite avaliar se o mercado premia ou desconta o valor dos ativos.',
  ecoNAVAcao:
    'NAV economico estimado por acao. Formula: (NOI proxy / cap rate) + Cash − Divida Liquida − Preferred. NOI proxy = Gross Profit do FMP (receita − custos diretos de propriedade, sem G&A). Cap rate baseado no setor REIT (NAREIT). Tres cenarios permitem testar sensibilidade ao cap rate.',
  ecoPrecoNAV:
    'Preco de mercado / NAV economico estimado. Racio mais realista do que o Preco/book NAV porque o NAV economico avalia imoveis a valor de mercado via cap rates, ao contrario do GAAP que usa custo historico.',
  ecoDesvio:
    'Desvio percentual do preco face ao NAV economico estimado. Premium = mercado paga acima do valor de mercado dos ativos; Discount = potencial subvalorizacao. Usar em conjunto com qualidade do portfolio e alavancagem.',
  ecoCapRate:
    'Cap rate (taxa de capitalizacao) usado no cenario selecionado. Representa o retorno implicito dos ativos imoveis. Cap rates mais baixos = ativos de maior qualidade (mais caros); mais altos = ativos de maior risco ou menor qualidade. Cenarios: Otimista (-0.5pp), Base, Conservador (+0.75pp).',
  ecoNOI:
    'NOI proxy TTM (trailing 12 meses, ultimo relatorio anual). Fonte: Gross Profit do FMP = Receita − custos diretos de propriedade (exclui G&A, depreciacao, juros). Para REITs net lease e industrial e uma boa aproximacao ao NOI real. Para REITs diversificados ou de hotel pode sobrestimar — usa os cenarios para calibrar.',
} as const

// ── Pesos por perfil REIT (Phase 8) ─────────────────────────────────────────
const WEIGHT_PROFILES: Record<
  'growth' | 'income' | 'mixed',
  { pFFO: number; payout: number; debt: number; nav: number }
> = {
  growth: { pFFO: 0.45, payout: 0.1, debt: 0.3, nav: 0.15 },
  income: { pFFO: 0.25, payout: 0.25, debt: 0.15, nav: 0.35 },
  mixed: { pFFO: 0.35, payout: 0.2, debt: 0.25, nav: 0.2 },
}

// Flag de dynamic weights — espelha REIT_FLAGS.enableDynamicWeights do backend
const ENABLE_DYNAMIC_WEIGHTS = false

// ── Componente principal ─────────────────────────────────────────────────────

export default function ReitsToolkitPage() {
  const [symbol, setSymbol] = useState('O')
  const [frequency, setFrequency] = useState<Frequency>('Mensal')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [data, setData] = useState<Awaited<ReturnType<typeof fetchReitsToolkit>> | null>(null)
  const [navScenario, setNavScenario] = useState<NavScenario>('base')
  const [ffoView, setFfoView] = useState<FfoView>('narait')
  const [profileOverride, setProfileOverride] = useState<'growth' | 'income' | 'mixed' | null>(null)

  const handleSearch = async () => {
    const normalizedSymbol = symbol.trim().toUpperCase()
    if (!normalizedSymbol) {
      setError('Insere um ticker REIT valido.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const response = await fetchReitsToolkit(normalizedSymbol, frequency)
      setData(response)
    } catch (apiError) {
      console.error(apiError)
      setData(null)
      setError(
        'Nao foi possivel carregar os dados de REIT. Verifica os endpoints /reits/* no backend.',
      )
    } finally {
      setLoading(false)
    }
  }

  const valuation = data?.ddm?.valuation ?? null
  const diffNum = toNum(data?.ddm?.difference)
  const premiumNum = toNum(data?.nav?.premiumPercent)
  const priceToNAV = toNum(data?.nav?.priceToNAV)
  const payoutRatio = toNum(data?.ffo?.ffoPayoutRatio)
  const debtEbitda = toNum(data?.ffo?.debtToEbitda)

  // FFO toggle — resolve os valores a apresentar consoante a vista selecionada
  const ffoSource = data?.ffo?.ffoSource
  const hasNarait = toNum(data?.ffo?.ffoNaraitPerShare) !== null
  // Se não houver dados NAREIT, cai para simplified automaticamente; AFFO cai para simplified
  const activeFfoView: FfoView =
    ffoView === 'narait' && !hasNarait
      ? 'simplified'
      : ffoView === 'affo'
        ? 'simplified' // AFFO placeholder: falls back
        : ffoView
  const activeFfoPerShare: number | null =
    activeFfoView === 'narait'
      ? toNum(data?.ffo?.ffoNaraitPerShare)
      : activeFfoView === 'simplified'
        ? toNum(data?.ffo?.ffoSimplifiedPerShare)
        : toNum(data?.ffo?.operatingCFPerShare)
  const priceNum = toNum(data?.ffo?.price)
  const pFFO: number | null =
    activeFfoPerShare !== null && activeFfoPerShare > 0 && priceNum !== null
      ? priceNum / activeFfoPerShare
      : null

  // Phase 5: Profile detection + override
  const detectedProfile = data?.ddm?.reitProfile ?? 'mixed'
  const activeProfile = profileOverride ?? detectedProfile
  const ddmLowConfidence = data?.ddm?.ddmConfidence === 'low'

  // Phase 8: Dynamic weights
  const weights = ENABLE_DYNAMIC_WEIGHTS ? WEIGHT_PROFILES[activeProfile] : WEIGHT_PROFILES.mixed

  // ── Valuation Score (combinação ponderada dos sinais disponíveis) ───────────
  // Calcula um score 0-100 com base nos dados já carregados, sem nova chamada à API.
  type ScoreCoverage = { available: number; total: number; metrics: string[]; missing: string[] }
  function computeValuationScore(): {
    score: number
    label: string
    colorClass: string
    coverage: ScoreCoverage
  } | null {
    if (pFFO === null) return null
    let weighted = 0
    let total = 0
    const metrics: string[] = []
    const missing: string[] = []

    // P/FFO: quanto mais baixo, mais atrativo
    const pFFOScore =
      pFFO <= 12 ? 95 : pFFO <= 18 ? 80 : pFFO <= 22 ? 62 : pFFO <= 28 ? 42 : pFFO <= 35 ? 22 : 8
    weighted += pFFOScore * weights.pFFO
    total += weights.pFFO
    metrics.push('P/FFO')

    // Payout ratio: 70-85% saudável; acima de 90% risco de corte
    if (payoutRatio !== null) {
      const ps =
        payoutRatio < 60
          ? 78
          : payoutRatio < 75
            ? 95
            : payoutRatio < 85
              ? 80
              : payoutRatio < 95
                ? 38
                : 10
      weighted += ps * weights.payout
      total += weights.payout
      metrics.push('Payout')
    } else {
      missing.push('Payout')
    }

    // Dívida/EBITDA: <5x muito conservador, >9x risco
    if (debtEbitda !== null) {
      const ds =
        debtEbitda < 4 ? 95 : debtEbitda < 6 ? 80 : debtEbitda < 7.5 ? 52 : debtEbitda < 9 ? 28 : 8
      weighted += ds * weights.debt
      total += weights.debt
      metrics.push('Div./EBITDA')
    } else {
      missing.push('Div./EBITDA')
    }

    // NAV premium/discount: desconto = mais atrativo
    const navPremium = toNum(data?.nav?.premiumPercent)
    if (navPremium !== null) {
      const ns =
        navPremium < -15
          ? 95
          : navPremium < 0
            ? 80
            : navPremium < 15
              ? 60
              : navPremium < 30
                ? 32
                : 10
      weighted += ns * weights.nav
      total += weights.nav
      metrics.push('NAV premium')
    } else {
      missing.push('NAV premium')
    }

    if (total === 0) return null
    const score = Math.round(weighted / total)
    const label =
      score >= 75 ? 'Atrativo' : score >= 55 ? 'Neutro' : score >= 35 ? 'Cuidado' : 'Evitar'
    const colorClass =
      score >= 75
        ? 'text-emerald-400'
        : score >= 55
          ? 'text-blue-400'
          : score >= 35
            ? 'text-amber-400'
            : 'text-red-400'
    return {
      score,
      label,
      colorClass,
      coverage: { available: metrics.length, total: 4, metrics, missing },
    }
  }
  const valuationScore = data ? computeValuationScore() : null

  // Economic NAV — computed at component level for use in both header and body
  const ecoScenario = data?.nav?.economicNAV?.scenarios?.[navScenario]
  const ecoNavPerShare = ecoScenario?.navPerShare ?? null
  const ecoPrice2Nav =
    ecoNavPerShare && ecoNavPerShare > 0 ? (toNum(data?.nav?.price) ?? 0) / ecoNavPerShare : null
  const ecoDeviation = ecoScenario?.priceVsNav ?? null

  function ecoBadgeLabel(dev: number | null): string {
    if (dev === null) return ''
    if (dev > 2) return 'A prémio'
    if (dev < -2) return 'A desconto'
    return '≈ justo'
  }

  return (
    <TooltipProvider delayDuration={300}>
      <div className="px-4 pb-10 pt-6 sm:px-6 lg:px-10">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
          {/* ── Header ── */}
          <section className="rounded-2xl border border-border bg-card/70 p-5 sm:p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">REITs Toolkit</h1>
                <p className="text-sm text-muted-foreground">
                  DDM, FFO e NAV calculados a partir de demonstracoes financeiras reais.
                </p>
              </div>
              <Badge variant="outline" className="inline-flex items-center gap-2">
                <LandPlot className="h-3.5 w-3.5" />
                REIT analytics
              </Badge>
            </div>
            <MarketsNav />
          </section>

          {/* ── Formulário ── */}
          <Card className="border border-border/60 bg-card/75">
            <CardContent className="space-y-4 p-6">
              <div className="grid gap-4 md:grid-cols-[1fr_220px_auto] md:items-end">
                <div className="space-y-2">
                  <Label htmlFor="reit-symbol">Ticker REIT</Label>
                  <Input
                    id="reit-symbol"
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value)}
                    placeholder="Ex: O, VNQ, PLD"
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5">
                    <Label>Atualizacao dos dados</Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3.5 w-3.5 cursor-help text-muted-foreground/60" />
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-[220px] text-xs">
                        Periodicidade de refresco dos dados financeiros (income statement, cash
                        flow, balance sheet). Nao e a frequencia do dividendo — essa e detetada
                        automaticamente pelo historico de pagamentos.
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Select value={frequency} onValueChange={(v) => setFrequency(v as Frequency)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mensal">Mensal</SelectItem>
                      <SelectItem value="Trimestral">Trimestral</SelectItem>
                      <SelectItem value="Semestral">Semestral</SelectItem>
                      <SelectItem value="Anual">Anual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleSearch} disabled={loading} className="md:min-w-36">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Analisar
                </Button>
              </div>

              <div className="space-y-1.5">
                <p className="text-xs text-muted-foreground">REITs populares:</p>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_REITS.map(({ ticker, label }) => (
                    <button
                      key={ticker}
                      type="button"
                      onClick={() => setSymbol(ticker)}
                      className="rounded-md border border-border/60 bg-muted/40 px-2.5 py-1 text-xs transition-colors hover:bg-muted"
                      title={label}
                    >
                      {ticker}
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-2 rounded-md border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-400">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* ── Cards de resultados ── */}
          {data ? (
            <>
              <section className="grid gap-4 lg:grid-cols-3">
                {/* ── DDM ── azul */}
                <Card className="overflow-hidden border border-border/60 bg-card/75">
                  {/* accent strip */}
                  <div className="h-[3px] bg-gradient-to-r from-blue-500/80 to-blue-400/40" />
                  <CardContent className="p-6">
                    {/* header */}
                    <div className="mb-4 flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-medium uppercase tracking-wider text-blue-400/80">
                            DDM
                          </p>
                          {data.ddm.ddmDataPeriod && (
                            <span className="rounded bg-muted/50 px-1.5 py-0.5 text-[10px] text-muted-foreground/70 tabular-nums">
                              {data.ddm.ddmDataPeriod}
                            </span>
                          )}
                          {data.ddm.reitProfile && (
                            <Badge
                              variant="outline"
                              className="text-[9px] border-blue-500/40 text-blue-400"
                            >
                              {activeProfile === 'growth'
                                ? 'Crescimento'
                                : activeProfile === 'income'
                                  ? 'Rendimento'
                                  : 'Misto'}
                            </Badge>
                          )}
                        </div>
                        <p className="mt-0.5 text-sm font-semibold leading-tight">
                          {data.ddm.companyName ?? data.ddm.symbol}
                        </p>
                        {/* Profile override */}
                        {data.ddm.reitProfile && (
                          <div className="mt-1 flex gap-0.5">
                            {(['growth', 'income', 'mixed'] as const).map((p) => (
                              <button
                                key={p}
                                type="button"
                                onClick={() => setProfileOverride(p === detectedProfile ? null : p)}
                                className={`rounded px-1.5 py-0.5 text-[9px] transition-colors ${
                                  activeProfile === p
                                    ? 'bg-blue-500/20 text-blue-300'
                                    : 'bg-muted/30 text-muted-foreground/50 hover:bg-muted/50'
                                }`}
                              >
                                {p === 'growth' ? 'G' : p === 'income' ? 'I' : 'M'}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-1.5">
                        {diffNum !== null && (
                          <span
                            className={`text-xl font-bold tabular-nums leading-none ${diffNum <= 0 ? 'text-emerald-400' : 'text-red-400'}`}
                          >
                            {diffNum > 0 ? '+' : ''}
                            {diffNum.toFixed(1)}%
                          </span>
                        )}
                        {valuation && !ddmLowConfidence && (
                          <Badge
                            variant={
                              valuation === 'Subvalorizado'
                                ? 'default'
                                : valuation === 'Sobrevalorizado'
                                  ? 'destructive'
                                  : 'secondary'
                            }
                            className="inline-flex items-center gap-1 text-[10px]"
                          >
                            {valuation === 'Subvalorizado' ? (
                              <TrendingUp className="h-2.5 w-2.5" />
                            ) : valuation === 'Sobrevalorizado' ? (
                              <TrendingDown className="h-2.5 w-2.5" />
                            ) : (
                              <Minus className="h-2.5 w-2.5" />
                            )}
                            {valuation}
                          </Badge>
                        )}
                        {ddmLowConfidence && (
                          <Badge
                            variant="outline"
                            className="inline-flex items-center gap-1 text-[10px] border-amber-500/40 text-amber-400"
                          >
                            <AlertCircle className="h-2.5 w-2.5" />
                            DDM ↓ confiança
                          </Badge>
                        )}
                      </div>
                    </div>

                    <Divider />

                    {ddmLowConfidence && data.ddm.ddmConfidenceNote && (
                      <div className="mt-2 mb-1 flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-300">
                        <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                        <span>{data.ddm.ddmConfidenceNote}</span>
                      </div>
                    )}

                    {/* métricas */}
                    <div className="mt-2 space-y-0">
                      <MetricRow
                        label="Preco atual"
                        value={fmt(data.ddm.price, 2, ' USD')}
                        info={INFO.precoAtual}
                      />
                      <MetricRow
                        label="Valor intrinseco"
                        value={
                          data.ddm.intrinsicValue ? fmt(data.ddm.intrinsicValue, 2, ' USD') : 'N/A'
                        }
                        info={INFO.valorIntrinseco}
                      />
                      <MetricRow
                        label="Diferenca"
                        value={
                          diffNum !== null
                            ? `${diffNum > 0 ? '+' : ''}${diffNum.toFixed(2)}%`
                            : 'N/A'
                        }
                        info={INFO.diferenca}
                        highlight={
                          diffNum !== null ? (diffNum <= 0 ? 'positive' : 'negative') : undefined
                        }
                      />
                      {data.ddm.currentDividend != null && (
                        <MetricRow
                          label={`Dividendo atual (${data.ddm.paymentsPerYear === 12 ? 'mensal' : data.ddm.paymentsPerYear === 2 ? 'semestral' : data.ddm.paymentsPerYear === 1 ? 'anual' : 'trimestral'})`}
                          value={`$${Number(data.ddm.currentDividend).toFixed(4)}`}
                          info="Ultimo pagamento de dividendo registado (ajustado)."
                        />
                      )}
                      <MetricRow
                        label="Dividendo anual (TTM)"
                        value={
                          data.ddm.annualDividend
                            ? `$${Number(data.ddm.annualDividend).toFixed(2)}`
                            : 'N/A'
                        }
                        info={`Soma dos ultimos ${data.ddm.paymentsPerYear ?? 4} pagamentos (frequencia detetada automaticamente). Evita contagem incorreta de 5 quarters numa janela de 12 meses.`}
                      />
                      <MetricRow
                        label="Dividend yield (TTM)"
                        value={fmt(data.ddm.dividendYield, 2, '%')}
                        info="Yield calculado sobre o dividendo anual TTM (ultimos N pagamentos reais)."
                      />
                      {data.ddm.forwardAnnualDividend != null && (
                        <MetricRow
                          label="Dividendo forward"
                          value={`$${Number(data.ddm.forwardAnnualDividend).toFixed(2)}`}
                          info={`Projecao anual: ultimo pagamento × ${data.ddm.paymentsPerYear ?? 4}. Nao inclui crescimento futuro.`}
                        />
                      )}
                      {data.ddm.forwardDividendYield != null && (
                        <MetricRow
                          label="Yield forward"
                          value={fmt(data.ddm.forwardDividendYield, 2, '%')}
                          info="Yield sobre o dividendo forward (ultimo pagamento anualizado / preco atual)."
                          highlight={
                            toNum(data.ddm.forwardDividendYield) !== null
                              ? toNum(data.ddm.forwardDividendYield)! >= 4
                                ? 'positive'
                                : toNum(data.ddm.forwardDividendYield)! < 2
                                  ? 'negative'
                                  : 'neutral'
                              : undefined
                          }
                        />
                      )}
                      <MetricRow
                        label="Dividend CAGR (5a)"
                        value={fmt(data.ddm.dividendCagr, 2, '%')}
                        info={INFO.dividendCagr}
                      />
                      <MetricRow
                        label="Retorno exigido (CAPM)"
                        value={fmt(data.ddm.requiredReturn, 2, '%')}
                        info={INFO.retornoExigido}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* ── FFO ── emerald */}
                <Card className="overflow-hidden border border-border/60 bg-card/75">
                  <div className="h-[3px] bg-gradient-to-r from-emerald-500/80 to-emerald-400/40" />
                  <CardContent className="p-6">
                    {/* header */}
                    <div className="mb-3 flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-medium uppercase tracking-wider text-emerald-400/80">
                            FFO
                          </p>
                          {data.ffo.reportPeriod && (
                            <span className="rounded bg-muted/50 px-1.5 py-0.5 text-[10px] text-muted-foreground/70 tabular-nums">
                              {data.ffo.reportPeriod}
                            </span>
                          )}
                          <ConfidenceBadge level={data.ffo.ffoConfidence} />
                        </div>
                        <p className="mt-0.5 text-sm font-semibold leading-tight">
                          {data.ffo.companyName ?? 'Demonstracoes financeiras'}
                        </p>
                      </div>
                      {pFFO !== null && ffoSource !== 'not-applicable' && (
                        <div className="text-right">
                          <span
                            className={`text-xl font-bold tabular-nums leading-none ${pFFO < 20 ? 'text-emerald-400' : pFFO > 30 ? 'text-red-400' : 'text-foreground'}`}
                          >
                            {pFFO.toFixed(1)}x
                          </span>
                          <p className="mt-0.5 text-[10px] text-muted-foreground">P/FFO</p>
                        </div>
                      )}
                    </div>

                    {/* Toggle de fonte do FFO */}
                    {ffoSource !== 'not-applicable' && (
                      <div className="mb-3 flex gap-1">
                        {(['narait', 'simplified', 'cfop', 'affo'] as FfoView[]).map((v) => {
                          const labels: Record<FfoView, string> = {
                            narait: 'NAREIT',
                            simplified: 'Estimativa',
                            cfop: 'CF Op.',
                            affo: 'AFFO',
                          }
                          const isDisabled = (v === 'narait' && !hasNarait) || v === 'affo'
                          const isActive = activeFfoView === v
                          return (
                            <button
                              key={v}
                              disabled={isDisabled}
                              onClick={() => setFfoView(v)}
                              className={`rounded px-2.5 py-1 text-[11px] font-medium transition-colors ${
                                isDisabled
                                  ? 'cursor-not-allowed opacity-30'
                                  : isActive
                                    ? 'bg-emerald-500/20 text-emerald-300'
                                    : 'bg-muted/40 text-muted-foreground hover:bg-muted/70'
                              }`}
                            >
                              {labels[v]}
                              {((v === 'narait' && !hasNarait) || v === 'affo') && ' (n/d)'}
                            </button>
                          )
                        })}
                      </div>
                    )}

                    {/* Aviso contextual por tipo de REIT */}
                    {data.ffo.ffoNote && (
                      <div
                        className={`mb-3 flex items-start gap-2 rounded-lg border px-3 py-2 text-xs ${
                          ffoSource === 'not-applicable'
                            ? 'border-red-500/30 bg-red-500/10 text-red-300'
                            : activeFfoView === 'simplified' && ffoSource === 'simplified-specialty'
                              ? 'border-amber-500/30 bg-amber-500/10 text-amber-300'
                              : 'border-border/40 bg-muted/20 text-muted-foreground'
                        }`}
                      >
                        <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                        <span>{data.ffo.ffoNote}</span>
                      </div>
                    )}

                    <Divider />

                    <div className="mt-2 space-y-0">
                      <MetricRow
                        label={
                          activeFfoView === 'cfop'
                            ? `CF Op. / acao${data.ffo.operatingCFPerShareApprox ? ' (aprox.)' : ''}`
                            : 'FFO / acao'
                        }
                        value={
                          activeFfoPerShare !== null
                            ? fmt(activeFfoPerShare, 2, ' USD')
                            : activeFfoView === 'cfop'
                              ? '—'
                              : 'N/A'
                        }
                        info={activeFfoView === 'cfop' ? INFO.cashFlowOp : INFO.ffoAcao}
                      />
                      <MetricRow
                        label={activeFfoView === 'cfop' ? 'P/CF Op.' : 'P/FFO'}
                        value={pFFO !== null ? `${pFFO.toFixed(1)}x` : 'N/A'}
                        info={INFO.pFFO}
                        highlight={
                          pFFO !== null
                            ? pFFO < 20
                              ? 'positive'
                              : pFFO > 30
                                ? 'negative'
                                : 'neutral'
                            : undefined
                        }
                      />
                      <MetricRow
                        label="FFO Payout Ratio"
                        value={payoutRatio !== null ? `${payoutRatio.toFixed(1)}%` : 'N/A'}
                        info={INFO.payoutRatio}
                        highlight={
                          payoutRatio !== null
                            ? payoutRatio > 90
                              ? 'negative'
                              : payoutRatio < 60
                                ? 'positive'
                                : 'neutral'
                            : undefined
                        }
                        barValue={payoutRatio !== null ? payoutRatio : undefined}
                      />
                      <MetricRow
                        label="Divida/EBITDA"
                        value={
                          data.ffo.debtToEbitda
                            ? `${Number(data.ffo.debtToEbitda).toFixed(1)}x`
                            : 'N/A'
                        }
                        info={INFO.debtEbitda}
                        highlight={
                          debtEbitda !== null
                            ? debtEbitda < 6
                              ? 'positive'
                              : 'negative'
                            : undefined
                        }
                      />
                      <MetricRow
                        label="Divida/Equity"
                        value={
                          data.ffo.debtToEquity
                            ? `${Number(data.ffo.debtToEquity).toFixed(2)}x`
                            : 'N/A'
                        }
                        info={INFO.debtEquity}
                      />
                      {activeFfoView !== 'cfop' && (
                        <MetricRow
                          label={
                            activeFfoView === 'narait'
                              ? 'FFO total (NAREIT)'
                              : 'FFO total (estimativa)'
                          }
                          value={fmtLarge(data.ffo.ffo)}
                        />
                      )}
                      {activeFfoView === 'cfop' && (
                        <MetricRow
                          label="CF Operacional total"
                          value={fmtLarge(data.ffo.operatingCashFlow)}
                        />
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* ── NAV ── amber */}
                <Card className="overflow-hidden border border-border/60 bg-card/75">
                  <div className="h-[3px] bg-gradient-to-r from-amber-500/80 to-amber-400/40" />
                  <CardContent className="p-6">
                    {/* header */}
                    <div className="mb-4 flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-medium uppercase tracking-wider text-amber-400/80">
                            NAV
                          </p>
                          {data.nav.reportPeriod && (
                            <span className="rounded bg-muted/50 px-1.5 py-0.5 text-[10px] text-muted-foreground/70 tabular-nums">
                              {data.nav.reportPeriod}
                            </span>
                          )}
                          <ConfidenceBadge level={data.nav.navConfidence} />
                        </div>
                        <p className="mt-0.5 text-sm font-semibold leading-tight">
                          Balanco patrimonial
                        </p>
                        {priceToNAV !== null && (
                          <p className="mt-0.5 text-[11px] text-muted-foreground/60 tabular-nums">
                            Book: {priceToNAV.toFixed(2)}x
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-1.5">
                        {ecoPrice2Nav !== null ? (
                          <span
                            className={`text-xl font-bold tabular-nums leading-none ${ecoPrice2Nav <= 1 ? 'text-emerald-400' : ecoPrice2Nav > 1.4 ? 'text-red-400' : 'text-foreground'}`}
                          >
                            {ecoPrice2Nav.toFixed(2)}x
                          </span>
                        ) : priceToNAV !== null ? (
                          <span
                            className={`text-xl font-bold tabular-nums leading-none ${priceToNAV <= 1 ? 'text-emerald-400' : priceToNAV > 1.5 ? 'text-red-400' : 'text-foreground'}`}
                          >
                            {priceToNAV.toFixed(2)}x
                          </span>
                        ) : null}
                        {ecoDeviation !== null && ecoBadgeLabel(ecoDeviation) && (
                          <Badge
                            variant={
                              ecoDeviation < -2
                                ? 'default'
                                : ecoDeviation > 2
                                  ? 'secondary'
                                  : 'outline'
                            }
                            className="text-[10px]"
                          >
                            {ecoBadgeLabel(ecoDeviation)}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <Divider />

                    {/* ── Economic NAV ── */}
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                          NAV Economico
                        </p>
                        <InfoTip text="NAV economico (market-based): avalia os imoveis pelo seu valor de mercado usando cap rates setoriais — muito mais util do que o book NAV (contabilistico) para REITs." />
                      </div>

                      {/* toggle de cenários */}
                      <div className="flex gap-1">
                        {(['optimistic', 'base', 'conservative'] as NavScenario[]).map((s) => {
                          const LABELS: Record<NavScenario, string> = {
                            optimistic: 'Otimista',
                            base: 'Base',
                            conservative: 'Conservador',
                          }
                          return (
                            <button
                              key={s}
                              type="button"
                              onClick={() => setNavScenario(s)}
                              className={`flex-1 rounded-md border px-2 py-1 text-[10px] font-medium transition-colors ${
                                navScenario === s
                                  ? 'border-amber-500/60 bg-amber-500/15 text-amber-400'
                                  : 'border-border/50 bg-muted/30 text-muted-foreground hover:bg-muted/60'
                              }`}
                            >
                              {LABELS[s]}
                            </button>
                          )
                        })}
                      </div>

                      {/* NAV económico negativo: dívida > valor dos ativos neste cenário */}
                      {ecoNavPerShare !== null && ecoNavPerShare < 0 && (
                        <div className="mb-2 flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
                          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                          <div>
                            <span>
                              NAV economico negativo neste cenario: a divida liquida supera o valor
                              estimado dos ativos com o cap rate de{' '}
                              {ecoScenario?.capRate?.toFixed(2)}%. Tenta o cenario otimista ou
                              verifica se o NOI proxy (
                              {data.nav.economicNAV?.noIProxy
                                ? fmtLarge(data.nav.economicNAV.noIProxy)
                                : '\u2014'}
                              ) e representativo.
                            </span>
                            <p className="mt-1.5 text-[10px] text-red-300/70">
                              Causas provaveis: divida liquida elevada face ao valor dos ativos, NOI
                              proxy nao representativo do NOI real, ou cap rate demasiado alto para
                              a qualidade dos ativos.
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="space-y-0">
                        <MetricRow
                          label="NAV eco. / acao"
                          value={
                            ecoNavPerShare === null
                              ? 'N/A'
                              : ecoNavPerShare < 0
                                ? `${ecoNavPerShare.toFixed(2)} USD (negativo)`
                                : `$${ecoNavPerShare.toFixed(2)} USD`
                          }
                          info={INFO.ecoNAVAcao}
                          highlight={
                            ecoNavPerShare !== null && ecoNavPerShare < 0 ? 'negative' : undefined
                          }
                        />
                        <MetricRow
                          label="Preco / eco. NAV"
                          value={
                            ecoNavPerShare !== null && ecoNavPerShare < 0
                              ? 'N/A (NAV < 0)'
                              : ecoPrice2Nav !== null
                                ? `${ecoPrice2Nav.toFixed(2)}x`
                                : 'N/A'
                          }
                          info={INFO.ecoPrecoNAV}
                          highlight={
                            ecoNavPerShare !== null && ecoNavPerShare < 0
                              ? 'negative'
                              : ecoPrice2Nav !== null
                                ? ecoPrice2Nav <= 1
                                  ? 'positive'
                                  : ecoPrice2Nav > 1.4
                                    ? 'negative'
                                    : 'neutral'
                                : undefined
                          }
                        />
                        <MetricRow
                          label="Desvio"
                          value={
                            ecoNavPerShare !== null && ecoNavPerShare < 0
                              ? 'N/A (NAV < 0)'
                              : ecoDeviation !== null
                                ? `${ecoDeviation > 0 ? '+' : ''}${ecoDeviation.toFixed(1)}% (${ecoDeviation > 0 ? 'a prémio' : 'a desconto'})`
                                : 'N/A'
                          }
                          info={INFO.ecoDesvio}
                          highlight={
                            ecoNavPerShare !== null && ecoNavPerShare < 0
                              ? 'negative'
                              : ecoDeviation !== null
                                ? ecoDeviation <= 0
                                  ? 'positive'
                                  : 'negative'
                                : undefined
                          }
                        />
                        <MetricRow
                          label="Cap rate usado"
                          value={
                            ecoScenario?.capRate !== undefined
                              ? `${ecoScenario.capRate.toFixed(2)}%`
                              : '\u2014'
                          }
                          info={INFO.ecoCapRate}
                        />
                        {data.nav.impliedCapRate != null && (
                          <MetricRow
                            label="Cap rate implicito"
                            value={`${Number(data.nav.impliedCapRate).toFixed(2)}%`}
                            info="Cap rate implicito = NOI / Enterprise Value. Permite comparar com o cap rate setorial usado nos cenarios."
                          />
                        )}
                        <MetricRow
                          label="NOI proxy (TTM)"
                          value={
                            data.nav.economicNAV?.noIProxy
                              ? fmtLarge(data.nav.economicNAV.noIProxy)
                              : 'N/A'
                          }
                          info={INFO.ecoNOI}
                        />
                      </div>
                    </div>

                    <Divider />

                    {/* ── Book NAV ── */}
                    <div className="mt-2 space-y-0">
                      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground/60">
                        Book NAV
                      </p>
                      <MetricRow
                        label="NAV por acao"
                        value={data.nav.navPerShare ? fmt(data.nav.navPerShare, 2, ' USD') : 'N/A'}
                        info={INFO.navAcao}
                      />
                      <MetricRow
                        label="Preco / book NAV"
                        value={priceToNAV !== null ? `${priceToNAV.toFixed(2)}x` : 'N/A'}
                        info={INFO.precoNAV}
                      />
                      <MetricRow
                        label="vs. book NAV"
                        value={
                          premiumNum !== null
                            ? `${premiumNum > 0 ? '+' : ''}${premiumNum.toFixed(1)}% (${premiumNum > 0 ? 'premium' : 'discount'})`
                            : 'N/A'
                        }
                        info={INFO.premiumDiscount}
                        highlight={
                          premiumNum !== null
                            ? premiumNum <= 0
                              ? 'positive'
                              : 'negative'
                            : undefined
                        }
                        barValue={
                          premiumNum !== null ? Math.min(Math.abs(premiumNum), 100) : undefined
                        }
                      />
                      <MetricRow
                        label="NAV total"
                        value={fmtLarge(data.nav.nav)}
                        info={INFO.navTotal}
                      />
                      <MetricRow
                        label="Market Cap"
                        value={fmtLarge(data.nav.marketCap)}
                        info={INFO.marketCap}
                      />
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* ── Valuation Score ── */}
              {valuationScore && (
                <Card className="overflow-hidden border border-border/60 bg-card/75">
                  <div
                    className={`h-[3px] ${
                      valuationScore.score >= 75
                        ? 'bg-gradient-to-r from-emerald-500/80 to-emerald-400/40'
                        : valuationScore.score >= 55
                          ? 'bg-gradient-to-r from-blue-500/80 to-blue-400/40'
                          : valuationScore.score >= 35
                            ? 'bg-gradient-to-r from-amber-500/80 to-amber-400/40'
                            : 'bg-gradient-to-r from-red-500/80 to-red-400/40'
                    }`}
                  />
                  <CardContent className="p-6">
                    {/* header */}
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground/70">
                          Score de Valorizacao
                          {valuationScore.coverage && (
                            <span className="ml-2 font-normal normal-case text-muted-foreground/50">
                              ({valuationScore.coverage.available}/{valuationScore.coverage.total}{' '}
                              metricas)
                            </span>
                          )}
                        </p>
                        <p className="mt-0.5 text-sm text-muted-foreground">
                          Combinacao ponderada: P/FFO {(weights.pFFO * 100).toFixed(0)}% · Payout{' '}
                          {(weights.payout * 100).toFixed(0)}% · Div./EBITDA{' '}
                          {(weights.debt * 100).toFixed(0)}% · vs. NAV{' '}
                          {(weights.nav * 100).toFixed(0)}%
                        </p>
                      </div>
                      <div className="flex items-end gap-2">
                        <span
                          className={`text-4xl font-bold tabular-nums leading-none ${valuationScore.colorClass}`}
                        >
                          {valuationScore.score}
                        </span>
                        <div className="mb-0.5 flex flex-col">
                          <span
                            className={`text-base font-semibold leading-tight ${valuationScore.colorClass}`}
                          >
                            {valuationScore.label}
                          </span>
                          <span className="text-[11px] text-muted-foreground/60">/ 100</span>
                        </div>
                      </div>
                    </div>

                    {/* barra de progresso */}
                    <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-muted/40">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          valuationScore.score >= 75
                            ? 'bg-emerald-500'
                            : valuationScore.score >= 55
                              ? 'bg-blue-500'
                              : valuationScore.score >= 35
                                ? 'bg-amber-500'
                                : 'bg-red-500'
                        }`}
                        style={{ width: `${valuationScore.score}%` }}
                      />
                    </div>
                    <div className="mt-1.5 flex justify-between text-[10px] text-muted-foreground/40">
                      <span>0 · Evitar</span>
                      <span>35 · Cuidado</span>
                      <span>55 · Neutro</span>
                      <span>75 · Atrativo · 100</span>
                    </div>

                    {/* componentes individuais */}
                    <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {pFFO !== null && (
                        <div className="rounded-lg border border-border/40 bg-muted/20 px-3 py-2.5">
                          <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground/60">
                            P/FFO
                          </p>
                          <p
                            className={`mt-1 text-lg font-bold tabular-nums leading-none ${pFFO < 20 ? 'text-emerald-400' : pFFO > 30 ? 'text-red-400' : 'text-foreground'}`}
                          >
                            {pFFO.toFixed(1)}x
                          </p>
                          <p className="mt-1 text-[10px] text-muted-foreground/50">
                            peso {(weights.pFFO * 100).toFixed(0)}%
                          </p>
                        </div>
                      )}
                      {payoutRatio !== null && (
                        <div className="rounded-lg border border-border/40 bg-muted/20 px-3 py-2.5">
                          <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground/60">
                            Payout FFO
                          </p>
                          <p
                            className={`mt-1 text-lg font-bold tabular-nums leading-none ${payoutRatio > 90 ? 'text-red-400' : payoutRatio < 60 ? 'text-emerald-400' : 'text-foreground'}`}
                          >
                            {payoutRatio.toFixed(1)}%
                          </p>
                          <p className="mt-1 text-[10px] text-muted-foreground/50">
                            peso {(weights.payout * 100).toFixed(0)}%
                          </p>
                        </div>
                      )}
                      {debtEbitda !== null && (
                        <div className="rounded-lg border border-border/40 bg-muted/20 px-3 py-2.5">
                          <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground/60">
                            Div./EBITDA
                          </p>
                          <p
                            className={`mt-1 text-lg font-bold tabular-nums leading-none ${debtEbitda < 6 ? 'text-emerald-400' : debtEbitda > 8 ? 'text-red-400' : 'text-foreground'}`}
                          >
                            {debtEbitda.toFixed(1)}x
                          </p>
                          <p className="mt-1 text-[10px] text-muted-foreground/50">
                            peso {(weights.debt * 100).toFixed(0)}%
                          </p>
                        </div>
                      )}
                      {premiumNum !== null && (
                        <div className="rounded-lg border border-border/40 bg-muted/20 px-3 py-2.5">
                          <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground/60">
                            vs. Book NAV
                          </p>
                          <p
                            className={`mt-1 text-lg font-bold tabular-nums leading-none ${premiumNum <= 0 ? 'text-emerald-400' : premiumNum > 20 ? 'text-red-400' : 'text-foreground'}`}
                          >
                            {premiumNum > 0 ? '+' : ''}
                            {premiumNum.toFixed(1)}%
                          </p>
                          <p className="mt-1 text-[10px] text-muted-foreground/50">
                            peso {(weights.nav * 100).toFixed(0)}%
                          </p>
                        </div>
                      )}
                    </div>

                    {/* métricas em falta */}
                    {valuationScore.coverage.missing.length > 0 && (
                      <p className="mt-3 text-[10px] text-muted-foreground/40">
                        Em falta: {valuationScore.coverage.missing.join(', ')} — peso redistribuido
                      </p>
                    )}

                    {/* nota DDM baixa confiança */}
                    {ddmLowConfidence && (
                      <div className="mt-4 flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-300">
                        <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                        <span>
                          DDM excluido do Score (baixa confianca). Score calculado com P/FFO, Payout
                          e Divida/EBITDA.
                          {data.ddm.ddmConfidenceNote && ` ${data.ddm.ddmConfidenceNote}`}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <Card className="border border-dashed border-border bg-card/50">
              <CardContent className="p-6 text-sm text-muted-foreground">
                Executa uma analise REIT para carregar DDM, FFO e NAV calculados com dados reais.
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </TooltipProvider>
  )
}
