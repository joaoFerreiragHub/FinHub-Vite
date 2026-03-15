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

export default function FireSimulatorPage() {
  const portfoliosQuery = useFirePortfolioList({ page: 1, limit: 50 })
  const simulationMutation = useRunFireSimulation()

  const [selectedPortfolioId, setSelectedPortfolioId] = useState<string | null>(null)
  const [maxYears, setMaxYears] = useState('40')
  const [drip, setDrip] = useState(true)
  const [includeInflation, setIncludeInflation] = useState(true)
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
    return result.scenarios.find((scenario) => scenario.scenario === 'base') ?? result.scenarios[0] ?? null
  }, [result])

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
      const simulation = await simulationMutation.mutateAsync({
        portfolioId: selectedPortfolioId,
        payload: {
          scenarios: selectedScenarioList,
          maxYears: Number.isFinite(maxYearsValue) ? maxYearsValue : 40,
          drip,
          includeInflation,
        },
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
          <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">Simulacao por cenarios</h1>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Executa <code>POST /api/portfolio/:id/simulate</code> com configuracao de cenarios e horizonte.
          </p>
          <div className="mt-4">
            <FireToolNav />
          </div>
        </section>

        <Card>
          <CardHeader>
            <CardTitle>Parametros da simulacao</CardTitle>
            <CardDescription>Escolhe o portfolio, cenarios e horizonte temporal.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={onRunSimulation}>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-1.5">
                  <Label>Portfolio</Label>
                  <Select value={selectedPortfolioId ?? ''} onValueChange={(value) => setSelectedPortfolioId(value)}>
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
                  <Input type="number" min="1" max="50" value={maxYears} onChange={(event) => setMaxYears(event.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>DRIP</Label>
                  <div className="flex h-9 items-center gap-2 rounded-md border border-input px-3">
                    <Checkbox checked={drip} onCheckedChange={(checked) => setDrip(checked === true)} />
                    <span className="text-sm text-muted-foreground">Reinvestir dividendos</span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Inflacao</Label>
                  <div className="flex h-9 items-center gap-2 rounded-md border border-input px-3">
                    <Checkbox checked={includeInflation} onCheckedChange={(checked) => setIncludeInflation(checked === true)} />
                    <span className="text-sm text-muted-foreground">Incluir inflacao</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Cenarios</Label>
                <div className="flex flex-wrap gap-2">
                  {SCENARIOS.map((scenario) => (
                    <label key={scenario} className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-sm">
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
                    <p>Data FIRE: <strong>{scenario.fireDate ?? 'n/a'}</strong></p>
                    <p>Anos: <strong>{scenario.yearsToFire ?? 'n/a'}</strong></p>
                    <p>Contribuido: <strong>{formatMoney(scenario.totalContributed, result.currency)}</strong></p>
                    <p>Valor final: <strong>{formatMoney(scenario.finalPortfolioValue, result.currency)}</strong></p>
                  </CardContent>
                </Card>
              ))}
            </section>

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
                    <div key={`${suggestion.type}-${index}`} className="rounded-lg border border-border bg-background/50 p-3 text-sm">
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
                <CardDescription>Primeiros 12 pontos da timeline para leitura rapida.</CardDescription>
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
                            <td className="px-3 py-2 text-right">{formatMoney(point.portfolioValue, result.currency)}</td>
                            <td className="px-3 py-2 text-right">{formatMoney(point.targetValue, result.currency)}</td>
                            <td className="px-3 py-2 text-right">{point.progressPct.toFixed(2)}%</td>
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
