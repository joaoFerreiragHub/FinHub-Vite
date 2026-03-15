import { FormEvent, useEffect, useMemo, useState } from 'react'
import { BarChart3, PlayCircle, Target } from 'lucide-react'
import { toast } from 'react-toastify'
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

  const baseScenario = useMemo(() => {
    if (!result) return null
    return (
      result.scenarios.find((scenario) => scenario.scenario === 'base') ??
      result.scenarios[0] ??
      null
    )
  }, [result])

  const calibrationSummary = result?.assumptions.historicalCalibration
  const monteCarloResult = result?.monteCarlo ?? null
  const whatIfResult = result?.whatIf ?? null

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
                <CardContent className="space-y-3 text-sm">
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

                  <div className="overflow-auto rounded-lg border border-border">
                    <table className="w-full min-w-[520px] text-sm">
                      <thead className="bg-muted/40">
                        <tr>
                          <th className="px-3 py-2 text-left">Metrica</th>
                          <th className="px-3 py-2 text-right">Baseline</th>
                          <th className="px-3 py-2 text-right">Ajustado</th>
                          <th className="px-3 py-2 text-right">Delta</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-t border-border">
                          <td className="px-3 py-2">Meses para FIRE</td>
                          <td className="px-3 py-2 text-right">
                            {whatIfResult.baseline.monthsToFire ?? 'n/a'}
                          </td>
                          <td className="px-3 py-2 text-right">
                            {whatIfResult.adjusted.monthsToFire ?? 'n/a'}
                          </td>
                          <td className="px-3 py-2 text-right">
                            {whatIfResult.delta.monthsToFire ?? 'n/a'}
                          </td>
                        </tr>
                        <tr className="border-t border-border">
                          <td className="px-3 py-2">Valor final</td>
                          <td className="px-3 py-2 text-right">
                            {formatMoney(
                              whatIfResult.baseline.finalPortfolioValue,
                              result.currency,
                            )}
                          </td>
                          <td className="px-3 py-2 text-right">
                            {formatMoney(
                              whatIfResult.adjusted.finalPortfolioValue,
                              result.currency,
                            )}
                          </td>
                          <td className="px-3 py-2 text-right">
                            {formatMoney(whatIfResult.delta.finalPortfolioValue, result.currency)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
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
                <CardContent className="space-y-3 text-sm">
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
                        {monteCarloResult.yearsToFirePercentiles?.p50 ?? 'n/a'}
                      </p>
                    </div>
                  </div>

                  <div className="overflow-auto rounded-lg border border-border">
                    <table className="w-full min-w-[560px] text-sm">
                      <thead className="bg-muted/40">
                        <tr>
                          <th className="px-3 py-2 text-left">Horizonte</th>
                          <th className="px-3 py-2 text-right">Probabilidade acumulada</th>
                        </tr>
                      </thead>
                      <tbody>
                        {monteCarloResult.timelineSuccessProbability.slice(0, 12).map((item) => (
                          <tr key={`${item.month}-${item.date}`} className="border-t border-border">
                            <td className="px-3 py-2">
                              {item.years.toFixed(2)} anos ({item.date})
                            </td>
                            <td className="px-3 py-2 text-right">
                              {formatPct(item.probabilityPct, 2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
                  Timeline ({baseScenario?.scenario ? scenarioLabel(baseScenario.scenario) : 'n/a'})
                </CardTitle>
                <CardDescription>
                  Primeiros 12 pontos da timeline para leitura rapida.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {baseScenario?.timeline.length ? (
                  <div className="overflow-auto rounded-lg border border-border">
                    <table className="w-full min-w-[700px] text-sm">
                      <thead className="bg-muted/40">
                        <tr>
                          <th className="px-3 py-2 text-left">Mes</th>
                          <th className="px-3 py-2 text-left">Data</th>
                          <th className="px-3 py-2 text-right">Portfolio</th>
                          <th className="px-3 py-2 text-right">Target</th>
                          <th className="px-3 py-2 text-right">Progress</th>
                        </tr>
                      </thead>
                      <tbody>
                        {baseScenario.timeline.slice(0, 12).map((point) => (
                          <tr key={point.month} className="border-t border-border">
                            <td className="px-3 py-2">{point.month}</td>
                            <td className="px-3 py-2">{point.date}</td>
                            <td className="px-3 py-2 text-right">
                              {formatMoney(point.portfolioValue, result.currency)}
                            </td>
                            <td className="px-3 py-2 text-right">
                              {formatMoney(point.targetValue, result.currency)}
                            </td>
                            <td className="px-3 py-2 text-right">
                              {point.progressPct.toFixed(2)}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
