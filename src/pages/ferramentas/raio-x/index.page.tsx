import { useMemo, useState } from 'react'
import {
  Area,
  AreaChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  ArrowRight,
  BookmarkPlus,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Coins,
  CreditCard,
  Flame,
  History,
  PiggyBank,
  Shield,
  Target,
  Trash2,
  TrendingUp,
  Upload,
  Wallet,
} from 'lucide-react'
import { HomepageLayout } from '@/components/home/HomepageLayout'
import { PageHero } from '@/components/public'
import { Badge, Button, Card, CardContent, Input, Label, Progress } from '@/components/ui'
import {
  buildRaioXSummary,
  calculateInvestmentProjection,
  defaultRaioXInput,
  formatCurrencyPt,
  formatNumberPt,
  formatPercentPt,
} from '@/features/tools/financial/engine'
import { useRaioXStore } from '@/features/tools/financial/store'
import type {
  HealthMetric,
  RaioXInput,
  RaioXSnapshot,
  WhatIfScenario,
} from '@/features/tools/financial/types'

type NumberFieldProps = {
  id: keyof RaioXInput
  label: string
  value: number
  onChange: (id: keyof RaioXInput, value: number) => void
  hint?: string
  step?: number
  min?: number
  max?: number
}

const steps = [
  { id: 1, title: 'Base Financeira', icon: Wallet },
  { id: 2, title: 'Patrimonio e Divida', icon: Shield },
  { id: 3, title: 'FIRE e Cenarios', icon: Target },
  { id: 4, title: 'Resultado', icon: TrendingUp },
]

const metricStyle = {
  good: {
    badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/40',
    label: 'Forte',
    dot: 'bg-emerald-500',
  },
  attention: {
    badge: 'bg-amber-500/10 text-amber-400 border-amber-500/40',
    label: 'Atencao',
    dot: 'bg-amber-500',
  },
  risk: {
    badge: 'bg-rose-500/10 text-rose-400 border-rose-500/40',
    label: 'Risco',
    dot: 'bg-rose-500',
  },
}

const metricIcons: Record<string, typeof PiggyBank> = {
  'savings-rate': PiggyBank,
  'investment-rate': TrendingUp,
  'emergency-fund': Shield,
  dti: CreditCard,
  'fire-progress': Flame,
}

const metricMaxValues: Record<string, number> = {
  'savings-rate': 40,
  'investment-rate': 30,
  'emergency-fund': 12,
  dti: 60,
  'fire-progress': 100,
}

function NumberField({
  id,
  label,
  value,
  onChange,
  hint,
  step = 1,
  min = 0,
  max,
}: NumberFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-xs uppercase tracking-[0.08em] text-muted-foreground">
        {label}
      </Label>
      <Input
        id={id}
        type="number"
        value={value}
        step={step}
        min={min}
        max={max}
        onChange={(event) => {
          const next = Number(event.target.value)
          onChange(id, Number.isFinite(next) ? next : 0)
        }}
      />
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}

function renderMetricValue(metric: HealthMetric) {
  if (metric.key === 'emergency-fund') return `${formatNumberPt(metric.value, 1)} meses`
  return formatPercentPt(metric.value, 1)
}

function getScoreLabel(score: number) {
  if (score >= 80) return 'Excelente'
  if (score >= 65) return 'Bom'
  if (score >= 45) return 'Atencao'
  return 'Critico'
}

function getScoreColor(score: number) {
  if (score >= 70) return 'hsl(142, 71%, 45%)'
  if (score >= 45) return 'hsl(38, 92%, 50%)'
  return 'hsl(0, 84%, 60%)'
}

function ScoreRing({ score }: { score: number }) {
  const pct = Math.min(100, Math.max(0, score))
  const color = getScoreColor(score)
  return (
    <div
      className="score-ring"
      style={{ '--score-pct': `${pct}%`, '--score-color': color } as React.CSSProperties}
    >
      <div className="score-ring__inner">
        <span className="text-2xl font-bold text-foreground">{score}</span>
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
          {getScoreLabel(score)}
        </span>
      </div>
    </div>
  )
}

function buildChartData(
  currentNetWorth: number,
  monthlyContribution: number,
  scenarioRates: { conservador: number; base: number; otimista: number },
  years: number,
) {
  const data: { year: number; conservador: number; base: number; otimista: number }[] = []
  for (let y = 0; y <= years; y += 1) {
    data.push({
      year: y,
      conservador: calculateInvestmentProjection({
        initialAmount: currentNetWorth,
        monthlyContribution,
        annualRate: scenarioRates.conservador,
        years: y,
      }).finalBalance,
      base: calculateInvestmentProjection({
        initialAmount: currentNetWorth,
        monthlyContribution,
        annualRate: scenarioRates.base,
        years: y,
      }).finalBalance,
      otimista: calculateInvestmentProjection({
        initialAmount: currentNetWorth,
        monthlyContribution,
        annualRate: scenarioRates.otimista,
        years: y,
      }).finalBalance,
    })
  }
  return data
}

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: Array<{ value: number; name: string; color: string }>
  label?: number
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-border/60 bg-card/95 p-3 shadow-lg backdrop-blur-sm">
      <p className="mb-1.5 text-xs font-medium text-muted-foreground">Ano {label}</p>
      {payload.map((entry) => (
        <p key={entry.name} className="text-xs" style={{ color: entry.color }}>
          {entry.name}: <strong>{formatCurrencyPt(entry.value)}</strong>
        </p>
      ))}
    </div>
  )
}

function MetricCard({ metric }: { metric: HealthMetric }) {
  const style = metricStyle[metric.status]
  const Icon = metricIcons[metric.key] ?? TrendingUp
  const maxVal = metricMaxValues[metric.key] ?? 100
  const fillPct = Math.min(100, (Math.abs(metric.value) / maxVal) * 100)

  return (
    <div className="rounded-lg border border-border/60 bg-background/70 p-3 space-y-2">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div
            className={`inline-flex h-7 w-7 items-center justify-center rounded-lg ${
              metric.status === 'good'
                ? 'bg-emerald-500/10'
                : metric.status === 'attention'
                  ? 'bg-amber-500/10'
                  : 'bg-rose-500/10'
            }`}
          >
            <Icon
              className={`h-3.5 w-3.5 ${
                metric.status === 'good'
                  ? 'text-emerald-500'
                  : metric.status === 'attention'
                    ? 'text-amber-500'
                    : 'text-rose-500'
              }`}
            />
          </div>
          <p className="text-sm font-medium text-foreground">{metric.label}</p>
        </div>
        <Badge variant="outline" className={style.badge}>
          {style.label}
        </Badge>
      </div>
      <p className="text-sm font-semibold text-foreground">{renderMetricValue(metric)}</p>
      <div className="metric-bar">
        <div
          className={`metric-bar__fill metric-bar__fill--${metric.status}`}
          style={{ width: `${fillPct}%` }}
        />
      </div>
      <p className="text-xs text-muted-foreground">{metric.helper}</p>
    </div>
  )
}

function WhatIfCard({ scenario }: { scenario: WhatIfScenario }) {
  const isPositive = scenario.deltaVsBase >= 0
  return (
    <div
      className={`whatif-card ${isPositive ? 'whatif-card--positive' : 'whatif-card--negative'}`}
    >
      <p className="text-sm font-semibold text-foreground">{scenario.label}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{scenario.description}</p>
      <div className="mt-2 flex items-baseline gap-3">
        <span className="text-base font-bold text-foreground">
          {formatCurrencyPt(scenario.projectedNetWorth)}
        </span>
        <span
          className={`text-xs font-medium ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}
        >
          {isPositive ? '+' : ''}
          {formatCurrencyPt(scenario.deltaVsBase)}
        </span>
      </div>
      {scenario.estimatedYearsToFire !== null && (
        <p className="mt-1 text-xs text-muted-foreground">
          FIRE em ~{formatNumberPt(scenario.estimatedYearsToFire, 1)} anos
        </p>
      )}
    </div>
  )
}

function SnapshotRow({
  snapshot,
  previous,
  onLoad,
  onDelete,
}: {
  snapshot: RaioXSnapshot
  previous?: RaioXSnapshot
  onLoad: () => void
  onDelete: () => void
}) {
  const date = new Date(snapshot.date)
  const formatted = date.toLocaleDateString('pt-PT', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
  const scoreDelta = previous ? snapshot.summary.score - previous.summary.score : null

  return (
    <div className="flex items-center gap-3 rounded-lg border border-border/60 bg-background/50 px-3 py-2">
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-foreground truncate">{formatted}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-muted-foreground">Score: {snapshot.summary.score}</span>
          {scoreDelta !== null && scoreDelta !== 0 && (
            <span
              className={`text-xs font-medium ${scoreDelta > 0 ? 'text-emerald-500' : 'text-rose-500'}`}
            >
              {scoreDelta > 0 ? '↑' : '↓'}
              {Math.abs(scoreDelta)}
            </span>
          )}
          <span className="text-xs text-muted-foreground">
            | Poupanca: {formatPercentPt(snapshot.summary.savingsRate)}
          </span>
        </div>
      </div>
      <button
        type="button"
        onClick={onLoad}
        className="text-xs text-primary hover:underline flex items-center gap-1"
      >
        <Upload className="h-3 w-3" /> Carregar
      </button>
      <button
        type="button"
        onClick={onDelete}
        className="text-xs text-muted-foreground hover:text-rose-500"
      >
        <Trash2 className="h-3 w-3" />
      </button>
    </div>
  )
}

export function Page() {
  const [step, setStep] = useState(1)
  const [input, setInput] = useState<RaioXInput>(defaultRaioXInput)
  const [showHistory, setShowHistory] = useState(false)
  const summary = useMemo(() => buildRaioXSummary(input), [input])
  const { snapshots, saveSnapshot, deleteSnapshot, loadSnapshot } = useRaioXStore()

  const updateField = (id: keyof RaioXInput, value: number) => {
    setInput((current) => ({ ...current, [id]: value }))
  }

  const handleSaveSnapshot = () => {
    saveSnapshot(input, summary)
  }

  const handleLoadSnapshot = (id: string) => {
    const loaded = loadSnapshot(id)
    if (loaded) {
      setInput(loaded)
      setStep(4)
    }
  }

  const stepProgress = (step / steps.length) * 100
  const canGoBack = step > 1
  const canGoNext = step < steps.length

  const chartData = useMemo(() => {
    if (step !== 4 || summary.scenarios.length < 3) return []
    return buildChartData(
      Math.max(0, input.currentNetWorth),
      Math.max(0, input.monthlySavings) + Math.max(0, input.monthlyInvestments),
      {
        conservador: summary.scenarios[0].annualRate,
        base: summary.scenarios[1].annualRate,
        otimista: summary.scenarios[2].annualRate,
      },
      Math.max(1, input.yearsToGoal),
    )
  }, [
    step,
    input.currentNetWorth,
    input.monthlySavings,
    input.monthlyInvestments,
    input.yearsToGoal,
    summary.scenarios,
  ])

  return (
    <HomepageLayout>
      <div className="min-h-screen bg-background">
        <PageHero
          title="Raio-X Financeiro"
          subtitle="Diagnostico guiado para mapear rendimento, despesas, poupanca, investimento e progresso FIRE com cenarios reais."
          compact
          backgroundImage="https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=1800&q=80"
        />

        <section className="px-4 sm:px-6 md:px-10 lg:px-12 py-10">
          <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-[1.5fr_1fr]">
            {/* Main card */}
            <Card className="border border-primary/30 bg-card/80">
              <CardContent className="space-y-6 p-6 sm:p-7">
                {/* Progress header */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="inline-flex items-center gap-2 rounded-full border border-primary/35 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                      <Coins className="h-3.5 w-3.5" />
                      Wizard Raio-X
                    </div>
                    <span className="text-xs text-muted-foreground">
                      Passo {step} de {steps.length}
                    </span>
                  </div>
                  <Progress value={stepProgress} className="h-2.5" />
                </div>

                {/* Step tabs */}
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                  {steps.map((item) => {
                    const Icon = item.icon
                    const isActive = step === item.id
                    const isDone = step > item.id
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setStep(item.id)}
                        className={`rounded-lg border px-3 py-2 text-left transition ${
                          isActive
                            ? 'border-primary/60 bg-primary/10'
                            : isDone
                              ? 'border-emerald-500/40 bg-emerald-500/10'
                              : 'border-border/60 bg-background/40'
                        }`}
                      >
                        <div className="mb-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-background/80">
                          <Icon className="h-4 w-4" />
                        </div>
                        <p className="text-xs font-semibold text-foreground">{item.title}</p>
                      </button>
                    )
                  })}
                </div>

                {/* Step 1: Base Financeira */}
                {step === 1 && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <NumberField
                      id="monthlyIncome"
                      label="Rendimento mensal liquido"
                      value={input.monthlyIncome}
                      onChange={updateField}
                    />
                    <NumberField
                      id="monthlyExpenses"
                      label="Despesas mensais"
                      value={input.monthlyExpenses}
                      onChange={updateField}
                    />
                    <NumberField
                      id="monthlySavings"
                      label="Poupanca mensal"
                      value={input.monthlySavings}
                      onChange={updateField}
                      hint="Valor guardado sem considerar investimentos."
                    />
                    <NumberField
                      id="monthlyInvestments"
                      label="Investimento mensal"
                      value={input.monthlyInvestments}
                      onChange={updateField}
                    />
                    <NumberField
                      id="monthlyDebtPayments"
                      label="Prestacoes de divida / mes"
                      value={input.monthlyDebtPayments}
                      onChange={updateField}
                    />
                  </div>
                )}

                {/* Step 2: Patrimonio e Divida */}
                {step === 2 && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <NumberField
                      id="currentNetWorth"
                      label="Patrimonio liquido atual"
                      value={input.currentNetWorth}
                      onChange={updateField}
                    />
                    <NumberField
                      id="totalDebt"
                      label="Divida total atual"
                      value={input.totalDebt}
                      onChange={updateField}
                    />
                    <NumberField
                      id="currentEmergencyFund"
                      label="Fundo de emergencia atual"
                      value={input.currentEmergencyFund}
                      onChange={updateField}
                    />
                    <Card className="border border-border/60 bg-background/50">
                      <CardContent className="space-y-2 p-4">
                        <p className="text-xs uppercase tracking-[0.08em] text-muted-foreground">
                          Leitura rapida
                        </p>
                        <p className="text-sm text-foreground">
                          Fundo atual cobre{' '}
                          <strong>{formatNumberPt(summary.emergencyFundMonths, 1)} meses</strong> de
                          despesas.
                        </p>
                        <p className="text-sm text-foreground">
                          DTI estimado:{' '}
                          <strong>{formatPercentPt(summary.debtToIncomeRatio, 1)}</strong>.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Step 3: FIRE e Cenarios */}
                {step === 3 && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <NumberField
                      id="fireAnnualExpenses"
                      label="Despesas anuais para FIRE"
                      value={input.fireAnnualExpenses}
                      onChange={updateField}
                    />
                    <NumberField
                      id="yearsToGoal"
                      label="Horizonte objetivo (anos)"
                      value={input.yearsToGoal}
                      onChange={updateField}
                      min={1}
                    />
                    <NumberField
                      id="annualReturnRate"
                      label="Rentabilidade anual esperada (%)"
                      value={input.annualReturnRate}
                      onChange={updateField}
                      step={0.1}
                    />
                    <NumberField
                      id="annualInflationRate"
                      label="Inflacao anual (%)"
                      value={input.annualInflationRate}
                      onChange={updateField}
                      step={0.1}
                    />
                    <NumberField
                      id="effectiveTaxRate"
                      label="Taxa efetiva de imposto (%)"
                      value={input.effectiveTaxRate}
                      onChange={updateField}
                      step={0.1}
                    />
                    <NumberField
                      id="fireWithdrawalRate"
                      label="Taxa de levantamento FIRE (%)"
                      value={input.fireWithdrawalRate}
                      onChange={updateField}
                      step={0.1}
                      min={1}
                      max={10}
                    />
                  </div>
                )}

                {/* Step 4: Resultado */}
                {step === 4 && (
                  <div className="space-y-6">
                    {/* Top row: Score + KPIs */}
                    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
                      <ScoreRing score={summary.score} />
                      <div className="grid flex-1 gap-3 sm:grid-cols-3">
                        <Card className="border border-border/60 bg-background/50">
                          <CardContent className="space-y-1 p-4">
                            <p className="text-xs uppercase tracking-[0.08em] text-muted-foreground">
                              Fluxo mensal livre
                            </p>
                            <p className="text-xl font-semibold text-foreground">
                              {formatCurrencyPt(summary.monthlyFreeCashFlow)}
                            </p>
                          </CardContent>
                        </Card>
                        <Card className="border border-border/60 bg-background/50">
                          <CardContent className="space-y-1 p-4">
                            <p className="text-xs uppercase tracking-[0.08em] text-muted-foreground">
                              Alvo FIRE hoje
                            </p>
                            <p className="text-xl font-semibold text-foreground">
                              {formatCurrencyPt(summary.fireTargetToday)}
                            </p>
                          </CardContent>
                        </Card>
                        <Card className="border border-border/60 bg-background/50">
                          <CardContent className="space-y-1 p-4">
                            <p className="text-xs uppercase tracking-[0.08em] text-muted-foreground">
                              Progresso FIRE
                            </p>
                            <p className="text-xl font-semibold text-foreground">
                              {formatPercentPt(summary.fireProgress, 1)}
                            </p>
                          </CardContent>
                        </Card>
                      </div>
                    </div>

                    {/* Patrimony Evolution Chart */}
                    {chartData.length > 0 && (
                      <Card className="border border-border/60 bg-background/50">
                        <CardContent className="p-4">
                          <p className="mb-3 text-sm font-semibold text-foreground">
                            Evolucao patrimonial projetada
                          </p>
                          <div className="h-[260px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart
                                data={chartData}
                                margin={{ top: 5, right: 10, left: 10, bottom: 0 }}
                              >
                                <defs>
                                  <linearGradient id="gradConservador" x1="0" y1="0" x2="0" y2="1">
                                    <stop
                                      offset="5%"
                                      stopColor="hsl(38, 92%, 50%)"
                                      stopOpacity={0.3}
                                    />
                                    <stop
                                      offset="95%"
                                      stopColor="hsl(38, 92%, 50%)"
                                      stopOpacity={0}
                                    />
                                  </linearGradient>
                                  <linearGradient id="gradBase" x1="0" y1="0" x2="0" y2="1">
                                    <stop
                                      offset="5%"
                                      stopColor="hsl(217, 91%, 60%)"
                                      stopOpacity={0.3}
                                    />
                                    <stop
                                      offset="95%"
                                      stopColor="hsl(217, 91%, 60%)"
                                      stopOpacity={0}
                                    />
                                  </linearGradient>
                                  <linearGradient id="gradOtimista" x1="0" y1="0" x2="0" y2="1">
                                    <stop
                                      offset="5%"
                                      stopColor="hsl(142, 71%, 45%)"
                                      stopOpacity={0.3}
                                    />
                                    <stop
                                      offset="95%"
                                      stopColor="hsl(142, 71%, 45%)"
                                      stopOpacity={0}
                                    />
                                  </linearGradient>
                                </defs>
                                <XAxis
                                  dataKey="year"
                                  tick={{ fontSize: 11 }}
                                  tickLine={false}
                                  axisLine={false}
                                  label={{
                                    value: 'Anos',
                                    position: 'insideBottomRight',
                                    offset: -5,
                                    fontSize: 11,
                                  }}
                                />
                                <YAxis
                                  tick={{ fontSize: 11 }}
                                  tickLine={false}
                                  axisLine={false}
                                  tickFormatter={(v: number) => `${Math.round(v / 1000)}k`}
                                  width={45}
                                />
                                <Tooltip content={<ChartTooltip />} />
                                <ReferenceLine
                                  y={summary.fireTargetAdjusted}
                                  stroke="hsl(0, 84%, 60%)"
                                  strokeDasharray="6 4"
                                  label={{
                                    value: 'Meta FIRE',
                                    position: 'insideTopRight',
                                    fontSize: 10,
                                    fill: 'hsl(0, 84%, 60%)',
                                  }}
                                />
                                <Area
                                  type="monotone"
                                  dataKey="conservador"
                                  name="Conservador"
                                  stroke="hsl(38, 92%, 50%)"
                                  fill="url(#gradConservador)"
                                  strokeWidth={2}
                                />
                                <Area
                                  type="monotone"
                                  dataKey="base"
                                  name="Base"
                                  stroke="hsl(217, 91%, 60%)"
                                  fill="url(#gradBase)"
                                  strokeWidth={2}
                                />
                                <Area
                                  type="monotone"
                                  dataKey="otimista"
                                  name="Otimista"
                                  stroke="hsl(142, 71%, 45%)"
                                  fill="url(#gradOtimista)"
                                  strokeWidth={2}
                                />
                              </AreaChart>
                            </ResponsiveContainer>
                          </div>
                          <div className="mt-2 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <span
                                className="inline-block h-2 w-4 rounded-full"
                                style={{ background: 'hsl(38, 92%, 50%)' }}
                              />{' '}
                              Conservador
                            </span>
                            <span className="flex items-center gap-1">
                              <span
                                className="inline-block h-2 w-4 rounded-full"
                                style={{ background: 'hsl(217, 91%, 60%)' }}
                              />{' '}
                              Base
                            </span>
                            <span className="flex items-center gap-1">
                              <span
                                className="inline-block h-2 w-4 rounded-full"
                                style={{ background: 'hsl(142, 71%, 45%)' }}
                              />{' '}
                              Otimista
                            </span>
                            <span className="flex items-center gap-1">
                              <span
                                className="inline-block h-2 w-4 rounded-full border border-rose-500"
                                style={{ background: 'transparent' }}
                              />{' '}
                              Meta FIRE
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Health Matrix + Scenarios */}
                    <div className="grid gap-4 xl:grid-cols-2">
                      <Card className="border border-border/60 bg-background/50">
                        <CardContent className="space-y-3 p-4">
                          <p className="text-sm font-semibold text-foreground">
                            Matriz de saude financeira
                          </p>
                          <div className="space-y-2">
                            {summary.metrics.map((metric) => (
                              <MetricCard key={metric.key} metric={metric} />
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border border-border/60 bg-background/50">
                        <CardContent className="space-y-3 p-4">
                          <p className="text-sm font-semibold text-foreground">
                            Cenarios de projecao
                          </p>
                          <div className="space-y-2">
                            {summary.scenarios.map((scenario) => (
                              <div
                                key={scenario.name}
                                className="rounded-lg border border-border/60 bg-background/70 p-3"
                              >
                                <div className="flex items-center justify-between">
                                  <p className="text-sm font-medium text-foreground">
                                    {scenario.name}
                                  </p>
                                  <span className="text-xs text-muted-foreground">
                                    {formatPercentPt(scenario.annualRate, 1)} / ano
                                  </span>
                                </div>
                                <p className="mt-1 text-base font-semibold text-foreground">
                                  {formatCurrencyPt(scenario.finalValue)}
                                </p>
                              </div>
                            ))}
                          </div>
                          <div className="rounded-lg border border-primary/30 bg-primary/10 p-3 text-sm text-foreground">
                            Meta FIRE ajustada:{' '}
                            <strong>{formatCurrencyPt(summary.fireTargetAdjusted)}</strong>
                            <br />
                            {summary.estimatedYearsToFire === null ? (
                              <span>
                                Com o ritmo atual, a meta nao e atingida no horizonte simulado.
                              </span>
                            ) : (
                              <span>
                                Estimativa de alcance:{' '}
                                <strong>
                                  {formatNumberPt(summary.estimatedYearsToFire, 1)} anos
                                </strong>
                                .
                              </span>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* What-If Scenarios */}
                    {summary.whatIfScenarios.length > 0 && (
                      <div>
                        <p className="mb-3 text-sm font-semibold text-foreground">E se...?</p>
                        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                          {summary.whatIfScenarios.map((scenario) => (
                            <WhatIfCard key={scenario.key} scenario={scenario} />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Recommendations */}
                    <Card className="border border-border/60 bg-background/50">
                      <CardContent className="space-y-3 p-4">
                        <p className="text-sm font-semibold text-foreground">
                          Recomendacoes imediatas
                        </p>
                        <ul className="space-y-2">
                          {summary.recommendations.map((recommendation) => (
                            <li
                              key={recommendation}
                              className="flex items-start gap-2 text-sm text-foreground"
                            >
                              <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                              <span>{recommendation}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <Button asChild variant="outline" className="justify-between">
                            <a href="/ferramentas/calculadoras">
                              Ferramentas avulsas
                              <ArrowRight className="ml-1 h-4 w-4" />
                            </a>
                          </Button>
                          <Button type="button" onClick={handleSaveSnapshot} className="gap-1.5">
                            <BookmarkPlus className="h-4 w-4" />
                            Guardar Raio-X
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    {/* History */}
                    {snapshots.length > 0 && (
                      <div>
                        <button
                          type="button"
                          onClick={() => setShowHistory(!showHistory)}
                          className="mb-2 flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <History className="h-4 w-4" />
                          Historico ({snapshots.length})
                          <ChevronRight
                            className={`h-3.5 w-3.5 transition-transform ${showHistory ? 'rotate-90' : ''}`}
                          />
                        </button>
                        {showHistory && (
                          <div className="space-y-2">
                            {snapshots.slice(0, 10).map((snapshot, index) => (
                              <SnapshotRow
                                key={snapshot.id}
                                snapshot={snapshot}
                                previous={snapshots[index + 1]}
                                onLoad={() => handleLoadSnapshot(snapshot.id)}
                                onDelete={() => deleteSnapshot(snapshot.id)}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Navigation */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => canGoBack && setStep(step - 1)}
                    disabled={!canGoBack}
                  >
                    <ChevronLeft className="mr-1 h-4 w-4" />
                    Voltar
                  </Button>
                  {canGoNext ? (
                    <Button type="button" onClick={() => setStep(step + 1)}>
                      Seguinte
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button type="button" variant="outline" onClick={() => setStep(1)}>
                      Rever do inicio
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Sidebar */}
            <Card className="border border-border/60 bg-card/70">
              <CardContent className="space-y-4 p-6">
                <div className="flex items-center gap-3">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-foreground">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Resumo</h2>
                    <div className="inline-flex items-center gap-1.5 mt-0.5">
                      <span
                        className="inline-block h-2.5 w-2.5 rounded-full"
                        style={{ background: getScoreColor(summary.score) }}
                      />
                      <span className="text-xs font-medium text-muted-foreground">
                        Score {summary.score}/100
                      </span>
                    </div>
                  </div>
                </div>

                <ul className="space-y-2.5 text-sm text-muted-foreground">
                  {summary.metrics.map((metric) => {
                    const style = metricStyle[metric.status]
                    return (
                      <li key={metric.key} className="flex items-center justify-between gap-3">
                        <span className="flex items-center gap-2">
                          <span className={`inline-block h-2 w-2 rounded-full ${style.dot}`} />
                          {metric.label}
                        </span>
                        <strong className="text-foreground">{renderMetricValue(metric)}</strong>
                      </li>
                    )
                  })}
                </ul>

                <div className="border-t border-border/40 pt-3">
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex justify-between gap-3">
                      <span>Patrimonio projetado</span>
                      <strong className="text-foreground">
                        {formatCurrencyPt(summary.projectedNetWorthAfterTax)}
                      </strong>
                    </li>
                    {summary.estimatedYearsToFire !== null && (
                      <li className="flex justify-between gap-3">
                        <span>FIRE em</span>
                        <strong className="text-foreground">
                          {formatNumberPt(summary.estimatedYearsToFire, 1)} anos
                        </strong>
                      </li>
                    )}
                  </ul>
                </div>

                <div className="rounded-lg border border-border/60 bg-background/50 p-3 text-xs text-muted-foreground">
                  O Raio-X usa cenarios com impostos e inflacao para evitar projecoes optimistas
                  demais.
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </HomepageLayout>
  )
}

export default { Page }
