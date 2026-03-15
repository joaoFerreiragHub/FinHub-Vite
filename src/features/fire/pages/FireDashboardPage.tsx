import { useEffect, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Activity, PieChart, Target, TrendingUp } from 'lucide-react'
import { Badge, Card, CardContent, CardHeader, CardTitle, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui'
import { FireToolNav } from '../components/FireToolNav'
import { useFirePortfolioDetail, useFirePortfolioList } from '../hooks/useFirePortfolio'
import { firePortfolioService } from '../services/firePortfolioService'
import type { FirePortfolioCurrency } from '../types/firePortfolio'

function formatMoney(value: number, currency: FirePortfolioCurrency) {
  return new Intl.NumberFormat('pt-PT', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(value)
}

function computeCurrentTarget(portfolio: {
  fireTarget: {
    method: 'expenses' | 'passive_income' | 'target_amount'
    monthlyExpenses?: number
    desiredMonthlyIncome?: number
    targetAmount?: number
    withdrawalRate: number
  }
}) {
  if (portfolio.fireTarget.method === 'expenses') {
    const yearlyExpenses = (portfolio.fireTarget.monthlyExpenses ?? 0) * 12
    return yearlyExpenses / (portfolio.fireTarget.withdrawalRate || 0.04)
  }
  if (portfolio.fireTarget.method === 'passive_income') {
    return portfolio.fireTarget.desiredMonthlyIncome ?? 0
  }
  return portfolio.fireTarget.targetAmount ?? 0
}

export default function FireDashboardPage() {
  const portfoliosQuery = useFirePortfolioList({ page: 1, limit: 50 })
  const [selectedPortfolioId, setSelectedPortfolioId] = useState<string | null>(null)

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

  const detailQuery = useFirePortfolioDetail(selectedPortfolioId, { enabled: Boolean(selectedPortfolioId) })

  const baseSimulationQuery = useQuery({
    queryKey: ['fire', 'dashboard', 'base-simulation', selectedPortfolioId],
    queryFn: () =>
      firePortfolioService.simulatePortfolio(selectedPortfolioId || '', {
        scenarios: ['base'],
        maxYears: 40,
        drip: true,
        includeInflation: true,
      }),
    enabled: Boolean(selectedPortfolioId),
    staleTime: 20_000,
  })

  const selected = detailQuery.data
  const baseScenario = baseSimulationQuery.data?.scenarios[0]
  const currentTarget = selected ? computeCurrentTarget(selected) : 0

  const progress = useMemo(() => {
    if (!selected || currentTarget <= 0) return 0
    if (selected.fireTarget.method === 'passive_income') {
      const passiveIncome = selected.holdings.reduce((sum, holding) => {
        const value = holding.shares * (holding.currentPrice || holding.averageCost)
        return sum + value * (holding.dividendYield / 12)
      }, 0)
      return Math.max(0, Math.min(100, (passiveIncome / currentTarget) * 100))
    }
    return Math.max(0, Math.min(100, (selected.summary.currentValue / currentTarget) * 100))
  }, [selected, currentTarget])

  const allocation = useMemo(() => {
    if (!selected) return [] as Array<{ type: string; value: number; pct: number }>
    const total = selected.holdings.reduce(
      (sum, holding) => sum + holding.shares * (holding.currentPrice || holding.averageCost),
      0,
    )
    if (total <= 0) return []
    const grouped = new Map<string, number>()
    selected.holdings.forEach((holding) => {
      const value = holding.shares * (holding.currentPrice || holding.averageCost)
      grouped.set(holding.assetType, (grouped.get(holding.assetType) ?? 0) + value)
    })
    return [...grouped.entries()]
      .map(([type, value]) => ({ type, value, pct: (value / total) * 100 }))
      .sort((a, b) => b.value - a.value)
  }, [selected])

  return (
    <div className="px-4 pb-10 pt-6 sm:px-6 lg:px-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <section className="rounded-3xl border border-border bg-gradient-to-br from-card via-card to-muted/30 p-6 sm:p-8 lg:p-10">
          <Badge variant="outline" className="bg-background/80">
            FIRE - Dashboard
          </Badge>
          <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">Visao rapida de progresso FIRE</h1>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Resumo consolidado com dados do portfolio e simulacao base para acompanhamento continuo.
          </p>
          <div className="mt-4">
            <FireToolNav />
          </div>
        </section>

        <Card>
          <CardContent className="pt-6">
            <div className="max-w-xs space-y-1.5">
              <label className="text-sm font-medium">Portfolio</label>
              <Select value={selectedPortfolioId ?? ''} onValueChange={(value) => setSelectedPortfolioId(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleciona portfolio" />
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
          </CardContent>
        </Card>

        {!selected ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Sem portfolio para apresentar dashboard.</p>
            </CardContent>
          </Card>
        ) : (
          <>
            <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <TrendingUp className="h-4 w-4" />
                    Valor atual
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-semibold">{formatMoney(selected.summary.currentValue, selected.currency)}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Activity className="h-4 w-4" />
                    Investido
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-semibold">{formatMoney(selected.summary.totalInvested, selected.currency)}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Target className="h-4 w-4" />
                    Progresso atual
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-semibold">{progress.toFixed(2)}%</p>
                  <p className="text-xs text-muted-foreground">Target atual: {formatMoney(currentTarget, selected.currency)}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <PieChart className="h-4 w-4" />
                    Cenario base
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-semibold">{baseScenario?.yearsToFire ?? 'n/a'} anos</p>
                  <p className="text-xs text-muted-foreground">Data FIRE: {baseScenario?.fireDate ?? 'n/a'}</p>
                </CardContent>
              </Card>
            </section>

            <Card>
              <CardHeader>
                <CardTitle>Alocacao por tipo de ativo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {allocation.length ? (
                  allocation.map((item) => (
                    <div key={item.type} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{item.type}</span>
                        <span className="text-muted-foreground">
                          {item.pct.toFixed(2)}% ({formatMoney(item.value, selected.currency)})
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-muted">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${Math.min(item.pct, 100)}%` }} />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">Sem dados para distribuicao de alocacao.</p>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
