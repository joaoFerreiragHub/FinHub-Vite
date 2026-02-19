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

function toNum(value: number | string | null | undefined): number | null {
  if (value === null || value === undefined || value === '') return null
  const n = typeof value === 'number' ? value : Number.parseFloat(String(value))
  return Number.isNaN(n) ? null : n
}

function fmt(value: number | string | null | undefined, decimals = 2, suffix = ''): string {
  const n = toNum(value)
  if (n === null) return 'N/A'
  return `${n.toFixed(decimals)}${suffix}`
}

function fmtLarge(value: number | string | null | undefined): string {
  const n = toNum(value)
  if (n === null) return 'N/A'
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

// ── Componente principal ─────────────────────────────────────────────────────

export default function ReitsToolkitPage() {
  const [symbol, setSymbol] = useState('O')
  const [frequency, setFrequency] = useState<Frequency>('Mensal')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [data, setData] = useState<Awaited<ReturnType<typeof fetchReitsToolkit>> | null>(null)
  const [navScenario, setNavScenario] = useState<NavScenario>('base')

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
  const pFFO = toNum(data?.ffo?.pFFO)
  const payoutRatio = toNum(data?.ffo?.ffoPayoutRatio)
  const debtEbitda = toNum(data?.ffo?.debtToEbitda)

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
                  <Label>Frequencia</Label>
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
            <section className="grid gap-4 lg:grid-cols-3">
              {/* ── DDM ── azul */}
              <Card className="overflow-hidden border border-border/60 bg-card/75">
                {/* accent strip */}
                <div className="h-[3px] bg-gradient-to-r from-blue-500/80 to-blue-400/40" />
                <CardContent className="p-6">
                  {/* header */}
                  <div className="mb-4 flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-blue-400/80">
                        DDM
                      </p>
                      <p className="mt-0.5 text-sm font-semibold leading-tight">
                        {data.ddm.companyName ?? data.ddm.symbol}
                      </p>
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
                      {valuation && (
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
                    </div>
                  </div>

                  <Divider />

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
                        diffNum !== null ? `${diffNum > 0 ? '+' : ''}${diffNum.toFixed(2)}%` : 'N/A'
                      }
                      info={INFO.diferenca}
                      highlight={
                        diffNum !== null ? (diffNum <= 0 ? 'positive' : 'negative') : undefined
                      }
                    />
                    <MetricRow
                      label="Dividendo anual"
                      value={
                        data.ddm.annualDividend
                          ? `$${Number(data.ddm.annualDividend).toFixed(2)}`
                          : 'N/A'
                      }
                      info={INFO.dividendoAnual}
                    />
                    <MetricRow
                      label="Dividend yield"
                      value={fmt(data.ddm.dividendYield, 2, '%')}
                      info={INFO.dividendYield}
                    />
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
                  <div className="mb-4 flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-emerald-400/80">
                        FFO
                      </p>
                      <p className="mt-0.5 text-sm font-semibold leading-tight">
                        {data.ffo.companyName ?? 'Demonstracoes financeiras'}
                      </p>
                    </div>
                    {pFFO !== null && (
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

                  <Divider />

                  <div className="mt-2 space-y-0">
                    <MetricRow
                      label="FFO por acao"
                      value={data.ffo.ffoPerShare ? fmt(data.ffo.ffoPerShare, 2, ' USD') : 'N/A'}
                      info={INFO.ffoAcao}
                    />
                    <MetricRow
                      label="P/FFO"
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
                      label="CF Operacional / acao"
                      value={
                        data.ffo.operatingCFPerShare
                          ? fmt(data.ffo.operatingCFPerShare, 2, ' USD')
                          : 'N/A'
                      }
                      info={INFO.cashFlowOp}
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
                        debtEbitda !== null ? (debtEbitda < 6 ? 'positive' : 'negative') : undefined
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
                    <MetricRow label="FFO total" value={fmtLarge(data.ffo.ffo)} />
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
                      <p className="text-xs font-medium uppercase tracking-wider text-amber-400/80">
                        NAV
                      </p>
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

                    <div className="space-y-0">
                      <MetricRow
                        label="NAV eco. / acao"
                        value={
                          ecoNavPerShare !== null ? `$${ecoNavPerShare.toFixed(2)} USD` : 'N/A'
                        }
                        info={INFO.ecoNAVAcao}
                      />
                      <MetricRow
                        label="Preco / eco. NAV"
                        value={ecoPrice2Nav !== null ? `${ecoPrice2Nav.toFixed(2)}x` : 'N/A'}
                        info={INFO.ecoPrecoNAV}
                        highlight={
                          ecoPrice2Nav !== null
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
                          ecoDeviation !== null
                            ? `${ecoDeviation > 0 ? '+' : ''}${ecoDeviation.toFixed(1)}% (${ecoDeviation > 0 ? 'a prémio' : 'a desconto'})`
                            : 'N/A'
                        }
                        info={INFO.ecoDesvio}
                        highlight={
                          ecoDeviation !== null
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
                            : 'N/A'
                        }
                        info={INFO.ecoCapRate}
                      />
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
