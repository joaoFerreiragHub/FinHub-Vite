import { FormEvent, useEffect, useMemo, useState } from 'react'
import { ArrowDownRight, ArrowUpRight, BarChart3, PlayCircle, Target } from 'lucide-react'
import { toast } from 'react-toastify'
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Checkbox,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui'
import { ChartTooltip } from '@/components/ui/ChartTooltip'
import { getErrorMessage } from '@/lib/api/client'
import { FireToolNav } from '../components/FireToolNav'
import { useFirePortfolioList, useRunFireSimulation } from '../hooks/useFirePortfolio'
import type {
  FirePortfolioCurrency,
  FireSimulationInput,
  FireSimulationResult,
  FireSimulationScenario,
} from '../types/firePortfolio'

const SCENARIOS: FireSimulationScenario[] = ['optimistic', 'base', 'conservative', 'bear']

function scenarioLabel(scenario: FireSimulationScenario) {
  if (scenario === 'optimistic') return 'Optimistic'
  if (scenario === 'base') return 'Base'
  if (scenario === 'conservative') return 'Conservative'
  return 'Bear'
}

function formatMoney(value: number, currency: FirePortfolioCurrency) {
  return new Intl.NumberFormat('pt-PT', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(value)
}

function formatPct(value: number, digits = 2) {
  return `${value.toFixed(digits)}%`
}

type DeltaTone = 'positive' | 'negative' | 'neutral'
type FirePercentileKey = 'p10' | 'p50' | 'p90'

const FIRE_PERCENTILE_KEYS: FirePercentileKey[] = ['p10', 'p50', 'p90']

function resolveDeltaTone(delta: number | null, higherIsBetter: boolean): DeltaTone {
  if (delta === null || delta === 0) return 'neutral'
  const improved = higherIsBetter ? delta > 0 : delta < 0
  return improved ? 'positive' : 'negative'
}

function deltaToneClass(tone: DeltaTone) {
  if (tone === 'positive') return 'text-emerald-500'
  if (tone === 'negative') return 'text-rose-500'
  return 'text-foreground'
}

function formatSignedNumber(value: number | null, suffix: string) {
  if (value === null) return 'n/a'
  if (value === 0) return `0${suffix}`
  return `${value > 0 ? '+' : ''}${value}${suffix}`
}

function formatSignedMoney(value: number | null, currency: FirePortfolioCurrency) {
  if (value === null) return 'n/a'
  const abs = formatMoney(Math.abs(value), currency)
  if (value === 0) return abs
  return `${value > 0 ? '+' : '-'}${abs}`
}

type TimelineChartPoint = {
  month: number
  targetValue: number
} & Partial<Record<FireSimulationScenario, number>>

function formatCurrencyK(value: number, currency: FirePortfolioCurrency) {
  const symbol = currency === 'EUR' ? '€' : currency === 'USD' ? '$' : '£'
  return `${symbol}${(value / 1000).toFixed(0)}k`
}

function buildTimelineChartData(
  scenarios: FireSimulationResult['scenarios'],
  selectedScenarios: FireSimulationScenario[],
): TimelineChartPoint[] {
  if (!selectedScenarios.length || !scenarios.length) return []

  const selectedSet = new Set(selectedScenarios)
  const monthMap = new Map<number, TimelineChartPoint>()

  scenarios.forEach((scenarioResult) => {
    if (!selectedSet.has(scenarioResult.scenario)) return

    scenarioResult.timeline.forEach((point) => {
      const current = monthMap.get(point.month) ?? {
        month: point.month,
        targetValue: point.targetValue,
      }
      current[scenarioResult.scenario] = point.portfolioValue
      monthMap.set(point.month, current)
    })
  })

  const sorted = [...monthMap.values()].sort((a, b) => a.month - b.month)
  if (sorted.length <= 120) return sorted
  return sorted.filter((_, index) => index % 3 === 0 || index === sorted.length - 1)
}

export default function FireSimulatorPage() {
  const portfoliosQuery = useFirePortfolioList({ page: 1, limit: 50 })
  const simulationMutation = useRunFireSimulation()

  const [selectedPortfolioId, setSelectedPortfolioId] = useState<string | null>(null)
  const [maxYears, setMaxYears] = useState('40')
  const [drip, setDrip] = useState(true)
  const [includeInflation, setIncludeInflation] = useState(true)
  const [useHistoricalCalibration, setUseHistoricalCalibration] = useState(true)
  const [historicalLookbackMonths, setHistoricalLookbackMonths] = useState('36')
  const [whatIfEnabled, setWhatIfEnabled] = useState(true)
  const [whatIfScenario, setWhatIfScenario] = useState<FireSimulationScenario>('base')
  const [whatIfContributionDelta, setWhatIfContributionDelta] = useState('200')
  const [whatIfAnnualReturnShockPct, setWhatIfAnnualReturnShockPct] = useState('1')
  const [whatIfInflationShockPct, setWhatIfInflationShockPct] = useState('0.5')
  const [monteCarloEnabled, setMonteCarloEnabled] = useState(true)
  const [monteCarloScenario, setMonteCarloScenario] = useState<FireSimulationScenario>('base')
  const [monteCarloSimulations, setMonteCarloSimulations] = useState('1000')
  const [scenarioState, setScenarioState] = useState<Record<FireSimulationScenario, boolean>>({
    optimistic: true,
    base: true,
    conservative: true,
    bear: false,
  })
  const [result, setResult] = useState<FireSimulationResult | null>(null)

  const portfolios = useMemo(() => portfoliosQuery.data?.items ?? [], [portfoliosQuery.data?.items])

  useEffect(() => {
    if (!portfolios.length) {
      setSelectedPortfolioId(null)
      return
    }
    if (!selectedPortfolioId || !portfolios.some((item) => item.id === selectedPortfolioId)) {
      setSelectedPortfolioId(portfolios[0].id)
    }
  }, [portfolios, selectedPortfolioId])

  const selectedScenarioList = useMemo(
    () => SCENARIOS.filter((scenario) => scenarioState[scenario]),
    [scenarioState],
  )

  const calibrationSummary = result?.assumptions.historicalCalibration
  const monteCarloResult = result?.monteCarlo ?? null
  const whatIfResult = result?.whatIf ?? null
  const monteCarloTimelineData = monteCarloResult?.timelineSuccessProbability ?? []
  const timelineChartData = useMemo(
    () => (result ? buildTimelineChartData(result.scenarios, selectedScenarioList) : []),
    [result, selectedScenarioList],
  )

  const whatIfComparisonCards = useMemo(() => {
    if (!whatIfResult || !result) return []
    return [
      {
        key: 'months-to-fire',
        label: 'Tempo ate FIRE',
        baseline: whatIfResult.baseline.monthsToFire,
        adjusted: whatIfResult.adjusted.monthsToFire,
        delta: whatIfResult.delta.monthsToFire,
        higherIsBetter: false,
        renderValue: (value: number | null) => (value === null ? 'n/a' : `${value} meses`),
        renderDelta: (value: number | null) => formatSignedNumber(value, ' meses'),
      },
      {
        key: 'final-portfolio-value',
        label: 'Valor final projetado',
        baseline: whatIfResult.baseline.finalPortfolioValue,
        adjusted: whatIfResult.adjusted.finalPortfolioValue,
        delta: whatIfResult.delta.finalPortfolioValue,
        higherIsBetter: true,
        renderValue: (value: number | null) =>
          value === null ? 'n/a' : formatMoney(value, result.currency),
        renderDelta: (value: number | null) => formatSignedMoney(value, result.currency),
      },
      {
        key: 'passive-income',
        label: 'Rendimento passivo mensal',
        baseline: whatIfResult.baseline.projectedMonthlyPassiveIncome,
        adjusted: whatIfResult.adjusted.projectedMonthlyPassiveIncome,
        delta: whatIfResult.delta.projectedMonthlyPassiveIncome,
        higherIsBetter: true,
        renderValue: (value: number | null) =>
          value === null ? 'n/a' : formatMoney(value, result.currency),
        renderDelta: (value: number | null) => formatSignedMoney(value, result.currency),
      },
    ]
  }, [result, whatIfResult])

  const monteCarloYearsPercentiles = useMemo(() => {
    const yearsPercentiles = monteCarloResult?.yearsToFirePercentiles
    if (!yearsPercentiles) return null
    return FIRE_PERCENTILE_KEYS.map((key) => ({
      key,
      label: key.toUpperCase(),
      value: yearsPercentiles[key],
    }))
  }, [monteCarloResult])

  const monteCarloValuePercentiles = useMemo(() => {
    if (!monteCarloResult || !result) return null
    return FIRE_PERCENTILE_KEYS.map((key) => ({
      key,
      label: key.toUpperCase(),
      value: monteCarloResult.finalPortfolioValuePercentiles[key],
    }))
  }, [monteCarloResult, result])

  const monteCarloNarrativeYears =
    monteCarloResult?.yearsToFirePercentiles?.p50 ?? result?.assumptions.maxYears ?? null
  const monteCarloMatchesWhatIfScenario =
    whatIfResult !== null &&
    monteCarloResult !== null &&
    whatIfResult.scenario === monteCarloResult.scenario
  const onRunSimulation = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!selectedPortfolioId) {
      toast.error('Seleciona um portfolio para simular.')
      return
    }
    if (!selectedScenarioList.length) {
      toast.error('Seleciona pelo menos um cenario.')
      return
    }

    try {
      const maxYearsValue = Number.parseInt(maxYears, 10)
      const historicalLookbackMonthsValue = Number.parseInt(historicalLookbackMonths, 10)
      const whatIfContributionDeltaValue = Number.parseFloat(whatIfContributionDelta)
      const whatIfAnnualReturnShockValue = Number.parseFloat(whatIfAnnualReturnShockPct) / 100
      const whatIfInflationShockValue = Number.parseFloat(whatIfInflationShockPct) / 100
      const monteCarloSimulationsValue = Number.parseInt(monteCarloSimulations, 10)

      const payload: FireSimulationInput = {
        scenarios: selectedScenarioList,
        maxYears: Number.isFinite(maxYearsValue) ? maxYearsValue : 40,
        drip,
        includeInflation,
        useHistoricalCalibration,
        historicalLookbackMonths: Number.isFinite(historicalLookbackMonthsValue)
          ? historicalLookbackMonthsValue
          : 36,
      }

      if (whatIfEnabled) {
        payload.whatIf = {
          enabled: true,
          scenario: whatIfScenario,
          contributionDelta: Number.isFinite(whatIfContributionDeltaValue)
            ? whatIfContributionDeltaValue
            : 0,
          annualReturnShock: Number.isFinite(whatIfAnnualReturnShockValue)
            ? whatIfAnnualReturnShockValue
            : 0,
          inflationShock: Number.isFinite(whatIfInflationShockValue)
            ? whatIfInflationShockValue
            : 0,
        }
      }

      if (monteCarloEnabled) {
        payload.monteCarlo = {
          enabled: true,
          scenario: monteCarloScenario,
          simulations: Number.isFinite(monteCarloSimulationsValue)
            ? monteCarloSimulationsValue
            : 1000,
        }
      }

      const simulation = await simulationMutation.mutateAsync({
        portfolioId: selectedPortfolioId,
        payload,
      })
      setResult(simulation)
      toast.success('Simulacao FIRE concluida.')
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  return (
    <div className="px-4 pb-10 pt-6 sm:px-6 lg:px-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <section className="rounded-3xl border border-border bg-gradient-to-br from-card via-card to-muted/30 p-6 sm:p-8 lg:p-10">
          <Badge variant="outline" className="bg-background/80">
            FIRE - Simulador
          </Badge>
          <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
            Simulacao por cenarios
          </h1>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Executa <code>POST /api/portfolio/:id/simulate</code> com configuracao de cenarios e
            horizonte.
          </p>
          <div className="mt-4">
            <FireToolNav />
          </div>
        </section>

        <Card>
          <CardHeader>
            <CardTitle>Parametros da simulacao</CardTitle>
            <CardDescription>
              Escolhe portfolio, cenarios, calibracao historica, what-if e Monte Carlo.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={onRunSimulation}>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-1.5">
                  <Label>Portfolio</Label>
                  <Select
                    value={selectedPortfolioId ?? ''}
                    onValueChange={(value) => setSelectedPortfolioId(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleciona um portfolio" />
                    </SelectTrigger>
                    <SelectContent>
                      {portfolios.map((portfolio) => (
                        <SelectItem key={portfolio.id} value={portfolio.id}>
                          {portfolio.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Max anos</Label>
                  <Input
                    type="number"
                    min="1"
                    max="50"
                    value={maxYears}
                    onChange={(event) => setMaxYears(event.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>DRIP</Label>
                  <div className="flex h-9 items-center gap-2 rounded-md border border-input px-3">
                    <Checkbox
                      checked={drip}
                      onCheckedChange={(checked) => setDrip(checked === true)}
                    />
                    <span className="text-sm text-muted-foreground">Reinvestir dividendos</span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Inflacao</Label>
                  <div className="flex h-9 items-center gap-2 rounded-md border border-input px-3">
                    <Checkbox
                      checked={includeInflation}
                      onCheckedChange={(checked) => setIncludeInflation(checked === true)}
                    />
                    <span className="text-sm text-muted-foreground">Incluir inflacao</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Cenarios</Label>
                <div className="flex flex-wrap gap-2">
                  {SCENARIOS.map((scenario) => (
                    <label
                      key={scenario}
                      className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-sm"
                    >
                      <Checkbox
                        checked={scenarioState[scenario]}
                        onCheckedChange={(checked) =>
                          setScenarioState((prev) => ({ ...prev, [scenario]: checked === true }))
                        }
                      />
                      {scenarioLabel(scenario)}
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid gap-3 lg:grid-cols-3">
                <div className="space-y-3 rounded-lg border border-border bg-background/50 p-3">
                  <Label className="text-sm font-semibold">Calibracao historica</Label>
                  <div className="flex items-center gap-2 rounded-md border border-input px-3 py-2">
                    <Checkbox
                      checked={useHistoricalCalibration}
                      onCheckedChange={(checked) => setUseHistoricalCalibration(checked === true)}
                    />
                    <span className="text-sm text-muted-foreground">
                      Ativar calibracao por historico
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Lookback (meses)</Label>
                    <Input
                      type="number"
                      min="6"
                      max="120"
                      value={historicalLookbackMonths}
                      onChange={(event) => setHistoricalLookbackMonths(event.target.value)}
                      disabled={!useHistoricalCalibration}
                    />
                  </div>
                </div>

                <div className="space-y-3 rounded-lg border border-border bg-background/50 p-3">
                  <Label className="text-sm font-semibold">What-if</Label>
                  <div className="flex items-center gap-2 rounded-md border border-input px-3 py-2">
                    <Checkbox
                      checked={whatIfEnabled}
                      onCheckedChange={(checked) => setWhatIfEnabled(checked === true)}
                    />
                    <span className="text-sm text-muted-foreground">
                      Ativar comparacao baseline vs ajustado
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Cenario</Label>
                    <Select
                      value={whatIfScenario}
                      onValueChange={(value) => setWhatIfScenario(value as FireSimulationScenario)}
                      disabled={!whatIfEnabled}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SCENARIOS.map((scenario) => (
                          <SelectItem key={`whatif-${scenario}`} value={scenario}>
                            {scenarioLabel(scenario)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-3">
                    <div className="space-y-1.5">
                      <Label>Delta contribuicao</Label>
                      <Input
                        type="number"
                        step="10"
                        value={whatIfContributionDelta}
                        onChange={(event) => setWhatIfContributionDelta(event.target.value)}
                        disabled={!whatIfEnabled}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Choque retorno (%)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={whatIfAnnualReturnShockPct}
                        onChange={(event) => setWhatIfAnnualReturnShockPct(event.target.value)}
                        disabled={!whatIfEnabled}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Choque inflacao (%)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={whatIfInflationShockPct}
                        onChange={(event) => setWhatIfInflationShockPct(event.target.value)}
                        disabled={!whatIfEnabled}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3 rounded-lg border border-border bg-background/50 p-3">
                  <Label className="text-sm font-semibold">Monte Carlo</Label>
                  <div className="flex items-center gap-2 rounded-md border border-input px-3 py-2">
                    <Checkbox
                      checked={monteCarloEnabled}
                      onCheckedChange={(checked) => setMonteCarloEnabled(checked === true)}
                    />
                    <span className="text-sm text-muted-foreground">
                      Ativar probabilidade por horizonte
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Cenario</Label>
                    <Select
                      value={monteCarloScenario}
                      onValueChange={(value) =>
                        setMonteCarloScenario(value as FireSimulationScenario)
                      }
                      disabled={!monteCarloEnabled}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SCENARIOS.map((scenario) => (
                          <SelectItem key={`mc-${scenario}`} value={scenario}>
                            {scenarioLabel(scenario)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Simulacoes</Label>
                    <Input
                      type="number"
                      min="100"
                      max="5000"
                      step="100"
                      value={monteCarloSimulations}
                      onChange={(event) => setMonteCarloSimulations(event.target.value)}
                      disabled={!monteCarloEnabled}
                    />
                  </div>
                </div>
              </div>

              <Button type="submit" isLoading={simulationMutation.isPending}>
                <PlayCircle className="h-4 w-4" />
                Correr simulacao
              </Button>
            </form>
          </CardContent>
        </Card>

        {result ? (
          <>
            <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {result.scenarios.map((scenario) => (
                <Card key={scenario.scenario} className="border border-border/60">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between text-base">
                      <span>{scenarioLabel(scenario.scenario)}</span>
                      <Badge variant={scenario.achieved ? 'default' : 'secondary'}>
                        {scenario.achieved ? 'atingido' : 'nao atingido'}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <p>
                      Data FIRE: <strong>{scenario.fireDate ?? 'n/a'}</strong>
                    </p>
                    <p>
                      Anos: <strong>{scenario.yearsToFire ?? 'n/a'}</strong>
                    </p>
                    <p>
                      Contribuido:{' '}
                      <strong>{formatMoney(scenario.totalContributed, result.currency)}</strong>
                    </p>
                    <p>
                      Valor final:{' '}
                      <strong>{formatMoney(scenario.finalPortfolioValue, result.currency)}</strong>
                    </p>
                  </CardContent>
                </Card>
              ))}
            </section>

            {calibrationSummary ? (
              <Card>
                <CardHeader>
                  <CardTitle>Calibracao historica</CardTitle>
                  <CardDescription>
                    Holdings calibrados: {calibrationSummary.calibratedHoldings}/
                    {calibrationSummary.attemptedHoldings}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid gap-2 sm:grid-cols-3">
                    <div className="rounded-lg border border-border bg-background/50 p-3 text-sm">
                      <p className="text-muted-foreground">Source</p>
                      <p className="font-semibold">{calibrationSummary.source ?? 'n/a'}</p>
                    </div>
                    <div className="rounded-lg border border-border bg-background/50 p-3 text-sm">
                      <p className="text-muted-foreground">Calibrados</p>
                      <p className="font-semibold">{calibrationSummary.calibratedHoldings}</p>
                    </div>
                    <div className="rounded-lg border border-border bg-background/50 p-3 text-sm">
                      <p className="text-muted-foreground">Fallback</p>
                      <p className="font-semibold">
                        {Math.max(
                          0,
                          calibrationSummary.attemptedHoldings -
                            calibrationSummary.calibratedHoldings,
                        )}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : null}

            {whatIfResult ? (
              <Card>
                <CardHeader>
                  <CardTitle>Comparacao What-if</CardTitle>
                  <CardDescription>
                    Cenario {scenarioLabel(whatIfResult.scenario)} com choques aplicados ao
                    baseline.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <div className="grid gap-3 md:grid-cols-3">
                    <div className="rounded-lg border border-border bg-background/50 p-3">
                      <p className="text-muted-foreground">Delta contribuicao</p>
                      <p className="font-semibold">
                        {formatMoney(whatIfResult.assumptions.contributionDelta, result.currency)}
                      </p>
                    </div>
                    <div className="rounded-lg border border-border bg-background/50 p-3">
                      <p className="text-muted-foreground">Choque retorno</p>
                      <p className="font-semibold">
                        {formatPct(whatIfResult.assumptions.annualReturnShock * 100, 2)}
                      </p>
                    </div>
                    <div className="rounded-lg border border-border bg-background/50 p-3">
                      <p className="text-muted-foreground">Choque inflacao</p>
                      <p className="font-semibold">
                        {formatPct(whatIfResult.assumptions.inflationShock * 100, 2)}
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-3 lg:grid-cols-3">
                    {whatIfComparisonCards.map((metric) => {
                      const tone = resolveDeltaTone(metric.delta, metric.higherIsBetter)
                      const toneClass = deltaToneClass(tone)
                      const DeltaIcon = tone === 'negative' ? ArrowDownRight : ArrowUpRight
                      return (
                        <div
                          key={metric.key}
                          className="rounded-lg border border-border bg-card p-4 shadow-sm"
                        >
                          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            {metric.label}
                          </p>
                          <div className="mt-3 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-muted-foreground">Baseline</span>
                              <span className="font-semibold">
                                {metric.renderValue(metric.baseline)}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-muted-foreground">Ajustado</span>
                              <span className="font-semibold">
                                {metric.renderValue(metric.adjusted)}
                              </span>
                            </div>
                            <div className="rounded-md border border-border bg-background/60 px-2.5 py-2">
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">Delta</span>
                                <span
                                  className={`inline-flex items-center gap-1 text-sm font-semibold ${toneClass}`}
                                >
                                  {tone !== 'neutral' ? (
                                    <DeltaIcon className="h-3.5 w-3.5" />
                                  ) : null}
                                  {metric.renderDelta(metric.delta)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  <div className="rounded-lg border border-border bg-background/50 p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Probabilidade no cenario
                    </p>
                    <div className="mt-2 flex flex-wrap items-baseline gap-2">
                      <span className="text-2xl font-semibold">
                        {monteCarloResult
                          ? formatPct(monteCarloResult.successProbabilityPct, 2)
                          : 'n/a'}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {monteCarloResult
                          ? `Monte Carlo (${scenarioLabel(monteCarloResult.scenario)})`
                          : 'Ativa Monte Carlo para ler probabilidade de sucesso.'}
                      </span>
                    </div>
                    {monteCarloResult ? (
                      <p className="mt-2 text-xs text-muted-foreground">
                        {monteCarloMatchesWhatIfScenario
                          ? 'Cenario alinhado com o what-if selecionado.'
                          : 'Para comparacao direta, usa o mesmo cenario em what-if e Monte Carlo.'}
                      </p>
                    ) : null}
                    <p className="mt-1 text-xs text-muted-foreground">
                      O contrato atual devolve probabilidade por cenario Monte Carlo, sem delta
                      baseline vs ajustado.
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : null}

            {monteCarloResult ? (
              <Card>
                <CardHeader>
                  <CardTitle>Monte Carlo</CardTitle>
                  <CardDescription>
                    Probabilidade de atingir FIRE no cenario{' '}
                    {scenarioLabel(monteCarloResult.scenario)}.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <div className="rounded-lg border border-border bg-background/50 p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Leitura rapida
                    </p>
                    <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Probabilidade de sucesso</p>
                        <p className="text-3xl font-bold">
                          {formatPct(monteCarloResult.successProbabilityPct, 2)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Runs que atingiram FIRE</p>
                        <p className="text-lg font-semibold">
                          {monteCarloResult.achievedRuns}/{monteCarloResult.simulations}
                        </p>
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground">
                      {formatPct(monteCarloResult.successProbabilityPct, 2)} de probabilidade de
                      atingir FIRE em aproximadamente{' '}
                      {monteCarloNarrativeYears === null
                        ? 'n/a'
                        : `${monteCarloNarrativeYears.toFixed(1)} anos`}{' '}
                      com este cenario.
                    </p>
                  </div>

                  <div className="grid gap-3 lg:grid-cols-2">
                    <div className="rounded-lg border border-border bg-card p-3">
                      <p className="text-sm font-semibold">Curva de probabilidade por horizonte</p>
                      <div className="mt-3 h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart
                            data={monteCarloTimelineData}
                            margin={{ top: 12, right: 8, left: 0, bottom: 6 }}
                          >
                            <defs>
                              <linearGradient
                                id="fireProbabilityGradient"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                              >
                                <stop
                                  offset="0%"
                                  stopColor="hsl(var(--chart-1))"
                                  stopOpacity={0.42}
                                />
                                <stop
                                  offset="100%"
                                  stopColor="hsl(var(--chart-1))"
                                  stopOpacity={0}
                                />
                              </linearGradient>
                            </defs>
                            <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" />
                            <XAxis
                              dataKey="years"
                              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                              tickFormatter={(value) => `${Number(value).toFixed(0)}a`}
                            />
                            <YAxis
                              domain={[0, 100]}
                              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                              tickFormatter={(value) => `${value}%`}
                            />
                            <Tooltip
                              content={
                                <ChartTooltip
                                  dataset={monteCarloTimelineData as Array<Record<string, unknown>>}
                                  xDataKey="years"
                                  deltaDataKey="probabilityPct"
                                  valueLabel="Probabilidade"
                                  deltaLabel="Variacao"
                                  labelFormatter={(value) =>
                                    `Horizonte: ${Number(value ?? 0).toFixed(2)} anos`
                                  }
                                  valueFormatter={(value) => `${value.toFixed(2)}%`}
                                  deltaFormatter={(delta) =>
                                    `${delta > 0 ? '+' : ''}${delta.toFixed(2)} pp`
                                  }
                                />
                              }
                            />
                            <ReferenceLine
                              y={monteCarloResult.successProbabilityPct}
                              stroke="hsl(var(--muted-foreground))"
                              strokeDasharray="4 4"
                            />
                            <Area
                              type="monotone"
                              dataKey="probabilityPct"
                              stroke="hsl(var(--primary))"
                              fill="url(#fireProbabilityGradient)"
                              strokeWidth={2.5}
                              dot={{ r: 1.8 }}
                              activeDot={{ r: 4 }}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="rounded-lg border border-border bg-card p-3">
                        <p className="text-sm font-semibold">Percentis de tempo ate FIRE</p>
                        <div className="mt-3 grid grid-cols-3 gap-2">
                          {(monteCarloYearsPercentiles ?? []).map((item) => (
                            <div
                              key={`years-${item.key}`}
                              className="rounded-md border border-border bg-background/60 p-2.5 text-center"
                            >
                              <p className="text-xs text-muted-foreground">{item.label}</p>
                              <p className="mt-1 text-sm font-semibold">
                                {item.value.toFixed(1)} anos
                              </p>
                            </div>
                          ))}
                        </div>
                        {!monteCarloYearsPercentiles ? (
                          <p className="mt-2 text-xs text-muted-foreground">
                            Nao ha runs suficientes para percentis de tempo.
                          </p>
                        ) : null}
                      </div>

                      <div className="rounded-lg border border-border bg-card p-3">
                        <p className="text-sm font-semibold">Percentis de valor final</p>
                        <div className="mt-3 grid grid-cols-3 gap-2">
                          {(monteCarloValuePercentiles ?? []).map((item) => (
                            <div
                              key={`value-${item.key}`}
                              className="rounded-md border border-border bg-background/60 p-2.5 text-center"
                            >
                              <p className="text-xs text-muted-foreground">{item.label}</p>
                              <p className="mt-1 text-sm font-semibold">
                                {formatMoney(item.value, result.currency)}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-3 md:grid-cols-3">
                    <div className="rounded-lg border border-border bg-background/50 p-3">
                      <p className="text-muted-foreground">Probabilidade de sucesso</p>
                      <p className="font-semibold">
                        {formatPct(monteCarloResult.successProbabilityPct, 2)}
                      </p>
                    </div>
                    <div className="rounded-lg border border-border bg-background/50 p-3">
                      <p className="text-muted-foreground">Runs que atingiram FIRE</p>
                      <p className="font-semibold">
                        {monteCarloResult.achievedRuns}/{monteCarloResult.simulations}
                      </p>
                    </div>
                    <div className="rounded-lg border border-border bg-background/50 p-3">
                      <p className="text-muted-foreground">Percentil p50 (anos)</p>
                      <p className="font-semibold">
                        {monteCarloResult.yearsToFirePercentiles
                          ? `${monteCarloResult.yearsToFirePercentiles.p50.toFixed(1)}`
                          : 'n/a'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : null}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Sugestoes da simulacao
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {result.suggestions.length ? (
                  result.suggestions.map((suggestion, index) => (
                    <div
                      key={`${suggestion.type}-${index}`}
                      className="rounded-lg border border-border bg-background/50 p-3 text-sm"
                    >
                      <p className="font-semibold">{suggestion.type}</p>
                      <p className="text-muted-foreground">{suggestion.message}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">Sem sugestoes para este cenario.</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Projecao por cenario
                </CardTitle>
                <CardDescription>
                  {timelineChartData.length} meses agregados dos cenarios selecionados.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {timelineChartData.length ? (
                  <div className="overflow-hidden rounded-lg border border-border p-3">
                    <ResponsiveContainer width="100%" height={320}>
                      <AreaChart
                        data={timelineChartData}
                        margin={{ top: 12, right: 12, left: 0, bottom: 4 }}
                      >
                        <defs>
                          <linearGradient
                            id="fireScenarioGradientOptimistic"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop offset="0%" stopColor="hsl(var(--chart-2))" stopOpacity={0.4} />
                            <stop offset="100%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="fireScenarioGradientBase" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="hsl(var(--chart-1))" stopOpacity={0.4} />
                            <stop offset="100%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient
                            id="fireScenarioGradientConservative"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop offset="0%" stopColor="hsl(var(--chart-3))" stopOpacity={0.4} />
                            <stop offset="100%" stopColor="hsl(var(--chart-3))" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="fireScenarioGradientBear" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="hsl(var(--chart-4))" stopOpacity={0.4} />
                            <stop offset="100%" stopColor="hsl(var(--chart-4))" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" />
                        <XAxis
                          dataKey="month"
                          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                          tickFormatter={(value) => `A${Math.round(Number(value ?? 0) / 12)}`}
                        />
                        <YAxis
                          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                          tickFormatter={(value) => formatCurrencyK(Number(value), result.currency)}
                        />
                        <Tooltip
                          content={
                            <ChartTooltip
                              dataset={timelineChartData as Array<Record<string, unknown>>}
                              xDataKey="month"
                              deltaDataKey={
                                selectedScenarioList.includes('base')
                                  ? 'base'
                                  : (selectedScenarioList[0] ?? 'targetValue')
                              }
                              valueLabel="Valor"
                              deltaLabel="Variacao"
                              labelFormatter={(value) =>
                                `Ano ${Math.round(Number(value ?? 0) / 12)} (mes ${Number(value ?? 0)})`
                              }
                              valueFormatter={(value) => formatMoney(value, result.currency)}
                              deltaFormatter={(delta) =>
                                `${delta > 0 ? '+' : ''}${formatMoney(delta, result.currency)}`
                              }
                            />
                          }
                        />
                        <Legend />
                        {selectedScenarioList.map((scenario) => {
                          const color =
                            scenario === 'optimistic'
                              ? 'hsl(var(--chart-2))'
                              : scenario === 'base'
                                ? 'hsl(var(--chart-1))'
                                : scenario === 'conservative'
                                  ? 'hsl(var(--chart-3))'
                                  : 'hsl(var(--chart-4))'
                          const gradientId =
                            scenario === 'optimistic'
                              ? 'fireScenarioGradientOptimistic'
                              : scenario === 'base'
                                ? 'fireScenarioGradientBase'
                                : scenario === 'conservative'
                                  ? 'fireScenarioGradientConservative'
                                  : 'fireScenarioGradientBear'
                          return (
                            <Area
                              key={`timeline-${scenario}`}
                              type="monotone"
                              dataKey={scenario}
                              name={scenarioLabel(scenario)}
                              stroke={color}
                              fill={`url(#${gradientId})`}
                              strokeWidth={2}
                              dot={false}
                              activeDot={{ r: 3.5 }}
                              connectNulls
                            />
                          )
                        })}
                        <Line
                          type="monotone"
                          dataKey="targetValue"
                          name="Target"
                          stroke="hsl(var(--muted-foreground))"
                          strokeWidth={2}
                          strokeDasharray="6 4"
                          dot={false}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Sem timeline para mostrar.</p>
                )}
              </CardContent>
            </Card>
          </>
        ) : null}
      </div>
    </div>
  )
}
