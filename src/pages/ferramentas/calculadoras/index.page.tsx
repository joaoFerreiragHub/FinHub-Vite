import { useMemo, useState } from 'react'
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Calculator,
  CreditCard,
  DollarSign,
  PiggyBank,
  Scale,
  Shield,
  Target,
  TrendingUp,
  Wallet,
} from 'lucide-react'
import { HomepageLayout } from '@/components/home/HomepageLayout'
import { PageHero } from '@/components/public'
import {
  Badge,
  Button,
  Card,
  CardContent,
  Input,
  Label,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui'
import {
  calculateBudgetSummary,
  calculateDebtPayoff,
  calculateEmergencyFund,
  calculateInvestmentProjection,
  calculateRetirementPlan,
  calculateRoi,
  compareInvestments,
  estimateMonthsToTarget,
  formatCurrencyPt,
  formatNumberPt,
  formatPercentPt,
} from '@/features/tools/financial/engine'

/* ─── Shared helpers ─── */

type NumericInputProps = {
  id: string
  label: string
  value: number
  onChange: (value: number) => void
  hint?: string
  step?: number
  min?: number
  max?: number
  suffix?: string
}

function NumericInput({
  id,
  label,
  value,
  onChange,
  hint,
  step = 1,
  min = 0,
  max,
  suffix,
}: NumericInputProps) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-xs uppercase tracking-[0.08em] text-muted-foreground">
        {label}
      </Label>
      <div className="relative">
        <Input
          id={id}
          type="number"
          value={value}
          step={step}
          min={min}
          max={max}
          onChange={(event) => {
            const next = Number(event.target.value)
            onChange(Number.isFinite(next) ? next : 0)
          }}
          className={suffix ? 'pr-10' : ''}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
            {suffix}
          </span>
        )}
      </div>
      {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  )
}

function ResultRow({
  label,
  value,
  highlight,
  className,
}: {
  label: string
  value: string
  highlight?: boolean
  className?: string
}) {
  return (
    <div className={`flex items-center justify-between gap-3 ${className ?? ''}`}>
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={`text-sm font-semibold ${highlight ? 'text-primary' : 'text-foreground'}`}>
        {value}
      </span>
    </div>
  )
}

function StatusDot({ status }: { status: 'good' | 'attention' | 'risk' }) {
  const color =
    status === 'good' ? 'bg-emerald-500' : status === 'attention' ? 'bg-amber-500' : 'bg-rose-500'
  return <span className={`inline-block h-2 w-2 rounded-full ${color}`} />
}

function StatusBadge({
  status,
  labels,
}: {
  status: 'good' | 'attention' | 'risk'
  labels?: { good: string; attention: string; risk: string }
}) {
  const defaultLabels = { good: 'Saudavel', attention: 'Atencao', risk: 'Risco' }
  const l = labels ?? defaultLabels
  const styles = {
    good: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/40',
    attention: 'bg-amber-500/10 text-amber-400 border-amber-500/40',
    risk: 'bg-rose-500/10 text-rose-400 border-rose-500/40',
  }
  return (
    <Badge variant="outline" className={styles[status]}>
      {l[status]}
    </Badge>
  )
}

function ToolResultPanel({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={`space-y-3 rounded-xl border border-border/40 bg-card/60 backdrop-blur-sm p-5 ${className ?? ''}`}
    >
      {children}
    </div>
  )
}

function MiniChart({
  data,
  dataKey,
  color,
}: {
  data: Array<Record<string, number>>
  dataKey: string
  color: string
}) {
  return (
    <div className="h-[120px] w-full mt-2">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 0 }}>
          <defs>
            <linearGradient id={`grad-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="year" tick={{ fontSize: 9 }} tickLine={false} axisLine={false} />
          <YAxis hide />
          <Tooltip
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null
              return (
                <div className="rounded-lg border border-border/60 bg-card/95 px-2.5 py-1.5 shadow-lg text-xs">
                  <span className="text-muted-foreground">Ano {label}: </span>
                  <strong>{formatCurrencyPt(payload[0].value as number)}</strong>
                </div>
              )
            }}
          />
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            fill={`url(#grad-${dataKey})`}
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

function BudgetBar({
  label,
  pct,
  target,
  color,
}: {
  label: string
  pct: number
  target: number
  color: string
}) {
  const isOver = pct > target
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className={isOver ? 'text-rose-400 font-medium' : 'text-foreground'}>
          {formatPercentPt(pct, 0)} <span className="text-muted-foreground">/ {target}%</span>
        </span>
      </div>
      <div className="h-2 rounded-full bg-muted/30">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${Math.min(pct, 100)}%`,
            background: isOver ? 'hsl(0, 84%, 60%)' : color,
          }}
        />
      </div>
    </div>
  )
}

/* ─── Page ─── */

export function Page() {
  const [activeTab, setActiveTab] = useState('juros')

  // Compound Interest
  const [compound, setCompound] = useState({
    initialAmount: 10000,
    monthlyContribution: 250,
    annualRate: 7,
    years: 20,
    inflationRate: 2.5,
    taxRate: 28,
  })

  // Investment Simulator
  const [simulator, setSimulator] = useState({
    initialAmount: 25000,
    monthlyContribution: 400,
    annualRate: 6.5,
    years: 15,
    targetAmount: 250000,
  })

  // Retirement
  const [retirement, setRetirement] = useState({
    monthlyExpensesToday: 1600,
    yearsToRetirement: 22,
    inflationRate: 2.5,
    withdrawalRate: 4,
    currentCapital: 35000,
    expectedReturnRate: 6.5,
    plannedMonthlyContribution: 400,
  })

  // ROI
  const [roi, setRoi] = useState({
    initialCost: 5000,
    currentValue: 6200,
    additionalCashFlow: 400,
    months: 18,
  })

  // Budget
  const [budget, setBudget] = useState({
    income: 2500,
    fixedExpenses: 1100,
    variableExpenses: 450,
    debtPayments: 180,
    investments: 300,
  })

  // Comparator
  const [comparison, setComparison] = useState({
    optionA: { initialAmount: 10000, monthlyContribution: 200, annualRate: 8, years: 15 },
    optionB: { initialAmount: 10000, monthlyContribution: 200, annualRate: 6, years: 15 },
  })

  // Emergency Fund
  const [emergency, setEmergency] = useState({
    monthlyExpenses: 1400,
    monthlyDebtPayments: 180,
    currentFund: 3500,
    dependents: 0,
    incomeStability: 'stable' as const,
  })

  // Debt Payoff
  const [debtPayoff, setDebtPayoff] = useState({
    debts: [
      { name: 'Cartao credito', balance: 3000, interestRate: 19.9, minimumPayment: 90 },
      { name: 'Emprestimo pessoal', balance: 8000, interestRate: 7.5, minimumPayment: 150 },
    ],
    extraMonthlyPayment: 100,
  })

  /* ─── Calculations ─── */

  const compoundResult = useMemo(() => calculateInvestmentProjection(compound), [compound])
  const compoundAfterTax = useMemo(() => {
    const netRate = compound.annualRate * (1 - compound.taxRate / 100)
    return calculateInvestmentProjection({ ...compound, annualRate: netRate })
  }, [compound])
  const compoundReal = useMemo(() => {
    const netRate = compound.annualRate * (1 - compound.taxRate / 100)
    const realRate = ((1 + netRate / 100) / (1 + compound.inflationRate / 100) - 1) * 100
    return calculateInvestmentProjection({ ...compound, annualRate: realRate })
  }, [compound])

  const compoundChartData = useMemo(() => {
    const data: { year: number; nominal: number; real: number }[] = []
    const netRate = compound.annualRate * (1 - compound.taxRate / 100)
    const realRate = ((1 + netRate / 100) / (1 + compound.inflationRate / 100) - 1) * 100
    for (let y = 0; y <= compound.years; y += 1) {
      data.push({
        year: y,
        nominal: calculateInvestmentProjection({ ...compound, years: y }).finalBalance,
        real: calculateInvestmentProjection({ ...compound, annualRate: realRate, years: y })
          .finalBalance,
      })
    }
    return data
  }, [compound])

  const simulatorProjection = useMemo(
    () =>
      calculateInvestmentProjection({
        initialAmount: simulator.initialAmount,
        monthlyContribution: simulator.monthlyContribution,
        annualRate: simulator.annualRate,
        years: simulator.years,
      }),
    [simulator],
  )

  const simulatorMonthsToTarget = useMemo(
    () =>
      estimateMonthsToTarget({
        initialAmount: simulator.initialAmount,
        monthlyContribution: simulator.monthlyContribution,
        annualRate: simulator.annualRate,
        targetAmount: simulator.targetAmount,
      }),
    [simulator],
  )

  const retirementResult = useMemo(
    () =>
      calculateRetirementPlan({
        monthlyExpensesToday: retirement.monthlyExpensesToday,
        yearsToRetirement: retirement.yearsToRetirement,
        inflationRate: retirement.inflationRate,
        withdrawalRate: retirement.withdrawalRate,
        currentCapital: retirement.currentCapital,
        expectedReturnRate: retirement.expectedReturnRate,
      }),
    [retirement],
  )

  const retirementProjection = useMemo(
    () =>
      calculateInvestmentProjection({
        initialAmount: retirement.currentCapital,
        monthlyContribution: retirement.plannedMonthlyContribution,
        annualRate: retirement.expectedReturnRate,
        years: retirement.yearsToRetirement,
      }),
    [retirement],
  )

  const retirementGap = Math.max(
    0,
    retirementResult.targetCapital - retirementProjection.finalBalance,
  )
  const retirementOnTrack = retirementProjection.finalBalance >= retirementResult.targetCapital

  const roiResult = useMemo(
    () =>
      calculateRoi({
        initialCost: roi.initialCost,
        currentValue: roi.currentValue,
        additionalCashFlow: roi.additionalCashFlow,
        months: roi.months,
      }),
    [roi],
  )

  const budgetResult = useMemo(
    () =>
      calculateBudgetSummary({
        income: budget.income,
        fixedExpenses: budget.fixedExpenses,
        variableExpenses: budget.variableExpenses,
        debtPayments: budget.debtPayments,
        investments: budget.investments,
      }),
    [budget],
  )

  const comparisonResult = useMemo(
    () => compareInvestments({ a: comparison.optionA, b: comparison.optionB }),
    [comparison],
  )

  const emergencyResult = useMemo(() => calculateEmergencyFund(emergency), [emergency])

  const debtResult = useMemo(() => calculateDebtPayoff(debtPayoff), [debtPayoff])

  const tabs = [
    { value: 'juros', label: 'Juros Compostos', icon: TrendingUp },
    { value: 'simulador', label: 'Simulador', icon: BarChart3 },
    { value: 'aposentadoria', label: 'Aposentadoria', icon: Target },
    { value: 'roi', label: 'ROI', icon: DollarSign },
    { value: 'budget', label: 'Budget', icon: Wallet },
    { value: 'comparador', label: 'Comparador', icon: Scale },
    { value: 'emergencia', label: 'Fundo Emergencia', icon: Shield },
    { value: 'divida', label: 'Divida', icon: CreditCard },
  ]

  return (
    <HomepageLayout>
      <div className="min-h-screen bg-background">
        <PageHero
          title="Ferramentas Avulsas"
          subtitle="Calculadoras e simuladores isolados, sem fluxo wizard. Usa de forma direta quando precisares."
          compact
          backgroundImage="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1800&q=80"
        />

        <section className="px-4 sm:px-6 md:px-10 lg:px-12 py-10">
          <div className="mx-auto max-w-6xl space-y-5">
            {/* Top bar */}
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="border-primary/40 bg-primary/10">
                Motor de calculo partilhado com o Raio-X
              </Badge>
              <Button asChild variant="outline" size="sm">
                <a href="/ferramentas/raio-x">
                  Abrir Raio-X
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              {/* Tab triggers with icons */}
              <TabsList className="h-auto w-full flex-wrap justify-start gap-1.5 bg-transparent p-0">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className="gap-1.5 text-xs sm:text-sm"
                    >
                      <Icon className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">{tab.label}</span>
                      <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                    </TabsTrigger>
                  )
                })}
              </TabsList>

              {/* ── Juros Compostos ── */}
              <TabsContent value="juros">
                <Card className="border border-border/60 bg-card/75">
                  <CardContent className="grid gap-5 p-6 lg:grid-cols-[1fr_1.1fr]">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                          <TrendingUp className="h-4 w-4 text-primary" />
                        </div>
                        <h2 className="text-lg font-semibold text-foreground">Juros Compostos</h2>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <NumericInput
                          id="compound-initial"
                          label="Capital inicial"
                          value={compound.initialAmount}
                          suffix="EUR"
                          onChange={(v) => setCompound((c) => ({ ...c, initialAmount: v }))}
                        />
                        <NumericInput
                          id="compound-monthly"
                          label="Aporte mensal"
                          value={compound.monthlyContribution}
                          suffix="EUR"
                          onChange={(v) => setCompound((c) => ({ ...c, monthlyContribution: v }))}
                        />
                        <NumericInput
                          id="compound-rate"
                          label="Rentabilidade anual"
                          value={compound.annualRate}
                          step={0.1}
                          suffix="%"
                          onChange={(v) => setCompound((c) => ({ ...c, annualRate: v }))}
                        />
                        <NumericInput
                          id="compound-years"
                          label="Prazo"
                          value={compound.years}
                          min={1}
                          suffix="anos"
                          onChange={(v) => setCompound((c) => ({ ...c, years: v }))}
                        />
                        <NumericInput
                          id="compound-tax"
                          label="Taxa imposto"
                          value={compound.taxRate}
                          step={0.5}
                          suffix="%"
                          hint="Sobre mais-valias (ex: 28% PT)"
                          onChange={(v) => setCompound((c) => ({ ...c, taxRate: v }))}
                        />
                        <NumericInput
                          id="compound-inflation"
                          label="Inflacao anual"
                          value={compound.inflationRate}
                          step={0.1}
                          suffix="%"
                          onChange={(v) => setCompound((c) => ({ ...c, inflationRate: v }))}
                        />
                      </div>
                    </div>
                    <ToolResultPanel>
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-foreground">Resultado</p>
                        <Badge
                          variant="outline"
                          className="text-[10px] border-primary/30 bg-primary/5"
                        >
                          Nominal + Real
                        </Badge>
                      </div>
                      <p className="text-2xl font-bold text-foreground">
                        {formatCurrencyPt(compoundResult.finalBalance)}
                      </p>
                      <div className="space-y-1.5">
                        <ResultRow
                          label="Total aportado"
                          value={formatCurrencyPt(compoundResult.totalContributions)}
                        />
                        <ResultRow
                          label="Juros acumulados"
                          value={formatCurrencyPt(compoundResult.totalInterest)}
                          highlight
                        />
                        <div className="border-t border-border/30 my-2" />
                        <ResultRow
                          label="Apos impostos"
                          value={formatCurrencyPt(compoundAfterTax.finalBalance)}
                        />
                        <ResultRow
                          label="Valor real (ajustado inflacao)"
                          value={formatCurrencyPt(compoundReal.finalBalance)}
                        />
                      </div>
                      <MiniChart
                        data={compoundChartData}
                        dataKey="nominal"
                        color="hsl(217, 91%, 60%)"
                      />
                      <p className="text-[10px] text-muted-foreground text-center">
                        Evolucao nominal ao longo do prazo
                      </p>
                    </ToolResultPanel>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* ── Simulador de Investimentos ── */}
              <TabsContent value="simulador">
                <Card className="border border-border/60 bg-card/75">
                  <CardContent className="grid gap-5 p-6 lg:grid-cols-[1fr_1.1fr]">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                          <BarChart3 className="h-4 w-4 text-primary" />
                        </div>
                        <h2 className="text-lg font-semibold text-foreground">
                          Simulador de Investimentos
                        </h2>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <NumericInput
                          id="sim-initial"
                          label="Capital inicial"
                          value={simulator.initialAmount}
                          suffix="EUR"
                          onChange={(v) => setSimulator((c) => ({ ...c, initialAmount: v }))}
                        />
                        <NumericInput
                          id="sim-monthly"
                          label="Aporte mensal"
                          value={simulator.monthlyContribution}
                          suffix="EUR"
                          onChange={(v) => setSimulator((c) => ({ ...c, monthlyContribution: v }))}
                        />
                        <NumericInput
                          id="sim-rate"
                          label="Rentabilidade anual"
                          value={simulator.annualRate}
                          step={0.1}
                          suffix="%"
                          onChange={(v) => setSimulator((c) => ({ ...c, annualRate: v }))}
                        />
                        <NumericInput
                          id="sim-years"
                          label="Prazo de simulacao"
                          value={simulator.years}
                          min={1}
                          suffix="anos"
                          onChange={(v) => setSimulator((c) => ({ ...c, years: v }))}
                        />
                        <NumericInput
                          id="sim-target"
                          label="Meta de capital"
                          value={simulator.targetAmount}
                          suffix="EUR"
                          onChange={(v) => setSimulator((c) => ({ ...c, targetAmount: v }))}
                        />
                      </div>
                    </div>
                    <ToolResultPanel>
                      <p className="text-sm font-semibold text-foreground">Leitura de cenario</p>
                      <p className="text-2xl font-bold text-foreground">
                        {formatCurrencyPt(simulatorProjection.finalBalance)}
                      </p>
                      <div className="space-y-1.5">
                        <ResultRow
                          label="Juros gerados"
                          value={formatCurrencyPt(simulatorProjection.totalInterest)}
                          highlight
                        />
                        <ResultRow
                          label="Total aportado"
                          value={formatCurrencyPt(simulatorProjection.totalContributions)}
                        />
                      </div>
                      <div className="rounded-lg border border-border/40 bg-background/50 p-3">
                        {simulatorMonthsToTarget === null ? (
                          <div className="flex items-center gap-2 text-sm text-rose-400">
                            <AlertTriangle className="h-4 w-4" />A meta nao e atingida no horizonte
                            simulado.
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-sm text-foreground">
                            <BadgeCheck className="h-4 w-4 text-emerald-500" />
                            Meta em{' '}
                            <strong className="ml-1">
                              {formatNumberPt(simulatorMonthsToTarget / 12, 1)} anos
                            </strong>
                          </div>
                        )}
                      </div>
                      {simulatorProjection.finalBalance >= simulator.targetAmount && (
                        <p className="text-xs text-emerald-500 flex items-center gap-1">
                          <BadgeCheck className="h-3 w-3" /> Meta superada em{' '}
                          {formatCurrencyPt(
                            simulatorProjection.finalBalance - simulator.targetAmount,
                          )}
                        </p>
                      )}
                    </ToolResultPanel>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* ── Aposentadoria ── */}
              <TabsContent value="aposentadoria">
                <Card className="border border-border/60 bg-card/75">
                  <CardContent className="grid gap-5 p-6 lg:grid-cols-[1fr_1.1fr]">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                          <Target className="h-4 w-4 text-primary" />
                        </div>
                        <h2 className="text-lg font-semibold text-foreground">
                          Calculadora de Aposentadoria
                        </h2>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <NumericInput
                          id="ret-expenses"
                          label="Despesas mensais hoje"
                          value={retirement.monthlyExpensesToday}
                          suffix="EUR"
                          onChange={(v) =>
                            setRetirement((c) => ({ ...c, monthlyExpensesToday: v }))
                          }
                        />
                        <NumericInput
                          id="ret-years"
                          label="Anos ate reforma"
                          value={retirement.yearsToRetirement}
                          min={1}
                          suffix="anos"
                          onChange={(v) => setRetirement((c) => ({ ...c, yearsToRetirement: v }))}
                        />
                        <NumericInput
                          id="ret-inflation"
                          label="Inflacao anual"
                          value={retirement.inflationRate}
                          step={0.1}
                          suffix="%"
                          onChange={(v) => setRetirement((c) => ({ ...c, inflationRate: v }))}
                        />
                        <NumericInput
                          id="ret-withdrawal"
                          label="Taxa levantamento"
                          value={retirement.withdrawalRate}
                          step={0.1}
                          min={1}
                          suffix="%"
                          onChange={(v) => setRetirement((c) => ({ ...c, withdrawalRate: v }))}
                        />
                        <NumericInput
                          id="ret-capital"
                          label="Capital atual"
                          value={retirement.currentCapital}
                          suffix="EUR"
                          onChange={(v) => setRetirement((c) => ({ ...c, currentCapital: v }))}
                        />
                        <NumericInput
                          id="ret-rate"
                          label="Rentabilidade anual"
                          value={retirement.expectedReturnRate}
                          step={0.1}
                          suffix="%"
                          onChange={(v) => setRetirement((c) => ({ ...c, expectedReturnRate: v }))}
                        />
                        <NumericInput
                          id="ret-planned"
                          label="Aporte mensal planeado"
                          value={retirement.plannedMonthlyContribution}
                          suffix="EUR"
                          onChange={(v) =>
                            setRetirement((c) => ({ ...c, plannedMonthlyContribution: v }))
                          }
                        />
                      </div>
                    </div>
                    <ToolResultPanel>
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-foreground">Projecao de reforma</p>
                        <StatusBadge
                          status={
                            retirementOnTrack
                              ? 'good'
                              : retirementGap < retirementResult.targetCapital * 0.3
                                ? 'attention'
                                : 'risk'
                          }
                          labels={{
                            good: 'No caminho',
                            attention: 'Quase la',
                            risk: 'Longe da meta',
                          }}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <ResultRow
                          label="Necessidade anual na reforma"
                          value={formatCurrencyPt(retirementResult.annualNeedAtRetirement)}
                        />
                        <ResultRow
                          label="Capital alvo"
                          value={formatCurrencyPt(retirementResult.targetCapital)}
                          highlight
                        />
                        <ResultRow
                          label="Aporte mensal recomendado"
                          value={formatCurrencyPt(retirementResult.requiredMonthlyContribution)}
                        />
                        <div className="border-t border-border/30 my-2" />
                        <ResultRow
                          label="Projecao com aporte atual"
                          value={formatCurrencyPt(retirementProjection.finalBalance)}
                        />
                      </div>
                      <div
                        className={`rounded-lg border p-3 ${retirementOnTrack ? 'border-emerald-500/30 bg-emerald-500/10' : 'border-rose-500/30 bg-rose-500/10'}`}
                      >
                        <p
                          className={`text-sm font-medium ${retirementOnTrack ? 'text-emerald-400' : 'text-rose-400'}`}
                        >
                          {retirementOnTrack
                            ? `Excedente de ${formatCurrencyPt(retirementProjection.finalBalance - retirementResult.targetCapital)}`
                            : `Gap para a meta: ${formatCurrencyPt(retirementGap)}`}
                        </p>
                      </div>
                    </ToolResultPanel>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* ── ROI ── */}
              <TabsContent value="roi">
                <Card className="border border-border/60 bg-card/75">
                  <CardContent className="grid gap-5 p-6 lg:grid-cols-[1fr_1.1fr]">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                          <DollarSign className="h-4 w-4 text-primary" />
                        </div>
                        <h2 className="text-lg font-semibold text-foreground">ROI Calculator</h2>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <NumericInput
                          id="roi-cost"
                          label="Custo inicial"
                          value={roi.initialCost}
                          suffix="EUR"
                          onChange={(v) => setRoi((c) => ({ ...c, initialCost: v }))}
                        />
                        <NumericInput
                          id="roi-value"
                          label="Valor atual"
                          value={roi.currentValue}
                          suffix="EUR"
                          onChange={(v) => setRoi((c) => ({ ...c, currentValue: v }))}
                        />
                        <NumericInput
                          id="roi-cash"
                          label="Cashflow adicional"
                          value={roi.additionalCashFlow}
                          suffix="EUR"
                          onChange={(v) => setRoi((c) => ({ ...c, additionalCashFlow: v }))}
                        />
                        <NumericInput
                          id="roi-months"
                          label="Periodo"
                          value={roi.months}
                          min={1}
                          suffix="meses"
                          onChange={(v) => setRoi((c) => ({ ...c, months: v }))}
                        />
                      </div>
                    </div>
                    <ToolResultPanel>
                      <p className="text-sm font-semibold text-foreground">Resultado ROI</p>
                      <p
                        className={`text-2xl font-bold ${roiResult.roi >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}
                      >
                        {formatPercentPt(roiResult.roi, 2)}
                      </p>
                      <div className="space-y-1.5">
                        <ResultRow
                          label="Ganho liquido"
                          value={formatCurrencyPt(roiResult.netGain)}
                          highlight={roiResult.netGain > 0}
                        />
                        <ResultRow
                          label="ROI anualizado"
                          value={formatPercentPt(roiResult.annualizedRoi, 2)}
                        />
                      </div>
                      {roi.initialCost > 0 && roiResult.netGain > 0 && (
                        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3">
                          <p className="text-xs text-emerald-400">
                            Break-even atingido. Cada euro investido gerou{' '}
                            {formatCurrencyPt(roiResult.netGain / roi.initialCost)} de retorno.
                          </p>
                        </div>
                      )}
                      {roiResult.netGain < 0 && (
                        <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-3">
                          <p className="text-xs text-rose-400">
                            Investimento negativo. Perda de{' '}
                            {formatCurrencyPt(Math.abs(roiResult.netGain))}.
                          </p>
                        </div>
                      )}
                    </ToolResultPanel>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* ── Budget Planner ── */}
              <TabsContent value="budget">
                <Card className="border border-border/60 bg-card/75">
                  <CardContent className="grid gap-5 p-6 lg:grid-cols-[1fr_1.1fr]">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                          <Wallet className="h-4 w-4 text-primary" />
                        </div>
                        <h2 className="text-lg font-semibold text-foreground">Budget Planner</h2>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <NumericInput
                          id="budget-income"
                          label="Rendimento mensal"
                          value={budget.income}
                          suffix="EUR"
                          onChange={(v) => setBudget((c) => ({ ...c, income: v }))}
                        />
                        <NumericInput
                          id="budget-fixed"
                          label="Despesas fixas"
                          value={budget.fixedExpenses}
                          suffix="EUR"
                          hint="Renda, agua, luz, seguros"
                          onChange={(v) => setBudget((c) => ({ ...c, fixedExpenses: v }))}
                        />
                        <NumericInput
                          id="budget-variable"
                          label="Despesas variaveis"
                          value={budget.variableExpenses}
                          suffix="EUR"
                          hint="Alimentacao, lazer, vestuario"
                          onChange={(v) => setBudget((c) => ({ ...c, variableExpenses: v }))}
                        />
                        <NumericInput
                          id="budget-debt"
                          label="Prestacoes de divida"
                          value={budget.debtPayments}
                          suffix="EUR"
                          onChange={(v) => setBudget((c) => ({ ...c, debtPayments: v }))}
                        />
                        <NumericInput
                          id="budget-investments"
                          label="Investimentos mensais"
                          value={budget.investments}
                          suffix="EUR"
                          onChange={(v) => setBudget((c) => ({ ...c, investments: v }))}
                        />
                      </div>
                    </div>
                    <ToolResultPanel>
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-foreground">Diagnostico mensal</p>
                        <StatusBadge status={budgetResult.rule503020.status} />
                      </div>
                      <div className="space-y-1.5">
                        <ResultRow
                          label="Despesa total"
                          value={formatCurrencyPt(budgetResult.totalExpenses)}
                        />
                        <ResultRow
                          label="Fluxo livre"
                          value={formatCurrencyPt(budgetResult.freeCashFlow)}
                          highlight={budgetResult.freeCashFlow > 0}
                        />
                        <ResultRow
                          label="Taxa de poupanca"
                          value={formatPercentPt(budgetResult.savingsRate, 1)}
                        />
                        <ResultRow
                          label="Fundo emergencia recomendado"
                          value={formatCurrencyPt(budgetResult.recommendedEmergencyFund)}
                        />
                      </div>
                      <div className="border-t border-border/30 pt-3 space-y-2">
                        <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                          Regra 50/30/20
                          <StatusDot status={budgetResult.rule503020.status} />
                        </p>
                        <BudgetBar
                          label="Necessidades (fixas + divida)"
                          pct={budgetResult.rule503020.needsPct}
                          target={50}
                          color="hsl(217, 91%, 60%)"
                        />
                        <BudgetBar
                          label="Desejos (variaveis)"
                          pct={budgetResult.rule503020.wantsPct}
                          target={30}
                          color="hsl(38, 92%, 50%)"
                        />
                        <BudgetBar
                          label="Poupanca/Investimento"
                          pct={budgetResult.rule503020.savingsPct}
                          target={20}
                          color="hsl(142, 71%, 45%)"
                        />
                      </div>
                    </ToolResultPanel>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* ── Comparador ── */}
              <TabsContent value="comparador">
                <Card className="border border-border/60 bg-card/75">
                  <CardContent className="space-y-5 p-6">
                    <div className="flex items-center gap-2">
                      <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                        <Scale className="h-4 w-4 text-primary" />
                      </div>
                      <h2 className="text-lg font-semibold text-foreground">
                        Comparador de Investimentos
                      </h2>
                    </div>
                    <div className="grid gap-4 lg:grid-cols-2">
                      {(['optionA', 'optionB'] as const).map((key, idx) => (
                        <div
                          key={key}
                          className="space-y-3 rounded-xl border border-border/60 bg-background/50 p-4"
                        >
                          <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                            <span
                              className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${idx === 0 ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}
                            >
                              {idx === 0 ? 'A' : 'B'}
                            </span>
                            Opcao {idx === 0 ? 'A' : 'B'}
                          </p>
                          <div className="grid gap-3 sm:grid-cols-2">
                            <NumericInput
                              id={`comp-${key}-initial`}
                              label="Capital inicial"
                              value={comparison[key].initialAmount}
                              suffix="EUR"
                              onChange={(v) =>
                                setComparison((c) => ({
                                  ...c,
                                  [key]: { ...c[key], initialAmount: v },
                                }))
                              }
                            />
                            <NumericInput
                              id={`comp-${key}-monthly`}
                              label="Aporte mensal"
                              value={comparison[key].monthlyContribution}
                              suffix="EUR"
                              onChange={(v) =>
                                setComparison((c) => ({
                                  ...c,
                                  [key]: { ...c[key], monthlyContribution: v },
                                }))
                              }
                            />
                            <NumericInput
                              id={`comp-${key}-rate`}
                              label="Rentabilidade anual"
                              value={comparison[key].annualRate}
                              step={0.1}
                              suffix="%"
                              onChange={(v) =>
                                setComparison((c) => ({
                                  ...c,
                                  [key]: { ...c[key], annualRate: v },
                                }))
                              }
                            />
                            <NumericInput
                              id={`comp-${key}-years`}
                              label="Prazo"
                              value={comparison[key].years}
                              min={1}
                              suffix="anos"
                              onChange={(v) =>
                                setComparison((c) => ({ ...c, [key]: { ...c[key], years: v } }))
                              }
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="grid gap-3 md:grid-cols-3">
                      <div
                        className={`rounded-xl border p-4 ${comparisonResult.delta >= 0 ? 'border-primary/30 bg-primary/10' : 'border-border/60 bg-background/50'}`}
                      >
                        <p className="text-xs uppercase tracking-[0.08em] text-muted-foreground mb-1">
                          Resultado A
                        </p>
                        <p className="text-lg font-semibold text-foreground">
                          {formatCurrencyPt(comparisonResult.resultA.finalBalance)}
                        </p>
                        {comparisonResult.delta >= 0 && (
                          <Badge
                            variant="outline"
                            className="mt-1 text-[10px] bg-emerald-500/10 text-emerald-400 border-emerald-500/40"
                          >
                            Vencedor
                          </Badge>
                        )}
                      </div>
                      <div
                        className={`rounded-xl border p-4 ${comparisonResult.delta < 0 ? 'border-primary/30 bg-primary/10' : 'border-border/60 bg-background/50'}`}
                      >
                        <p className="text-xs uppercase tracking-[0.08em] text-muted-foreground mb-1">
                          Resultado B
                        </p>
                        <p className="text-lg font-semibold text-foreground">
                          {formatCurrencyPt(comparisonResult.resultB.finalBalance)}
                        </p>
                        {comparisonResult.delta < 0 && (
                          <Badge
                            variant="outline"
                            className="mt-1 text-[10px] bg-emerald-500/10 text-emerald-400 border-emerald-500/40"
                          >
                            Vencedor
                          </Badge>
                        )}
                      </div>
                      <div className="rounded-xl border border-border/60 bg-background/50 p-4">
                        <p className="text-xs uppercase tracking-[0.08em] text-muted-foreground mb-1">
                          Diferenca
                        </p>
                        <p
                          className={`text-lg font-semibold ${comparisonResult.delta >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}
                        >
                          {comparisonResult.delta >= 0 ? '+' : ''}
                          {formatCurrencyPt(comparisonResult.delta)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatPercentPt(comparisonResult.deltaPct, 1)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* ── Fundo de Emergencia ── */}
              <TabsContent value="emergencia">
                <Card className="border border-border/60 bg-card/75">
                  <CardContent className="grid gap-5 p-6 lg:grid-cols-[1fr_1.1fr]">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                          <Shield className="h-4 w-4 text-primary" />
                        </div>
                        <h2 className="text-lg font-semibold text-foreground">
                          Fundo de Emergencia
                        </h2>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <NumericInput
                          id="em-expenses"
                          label="Despesas mensais"
                          value={emergency.monthlyExpenses}
                          suffix="EUR"
                          onChange={(v) => setEmergency((c) => ({ ...c, monthlyExpenses: v }))}
                        />
                        <NumericInput
                          id="em-debt"
                          label="Prestacoes divida / mes"
                          value={emergency.monthlyDebtPayments}
                          suffix="EUR"
                          onChange={(v) => setEmergency((c) => ({ ...c, monthlyDebtPayments: v }))}
                        />
                        <NumericInput
                          id="em-fund"
                          label="Fundo atual"
                          value={emergency.currentFund}
                          suffix="EUR"
                          onChange={(v) => setEmergency((c) => ({ ...c, currentFund: v }))}
                        />
                        <NumericInput
                          id="em-dependents"
                          label="Dependentes"
                          value={emergency.dependents}
                          min={0}
                          max={10}
                          onChange={(v) => setEmergency((c) => ({ ...c, dependents: v }))}
                        />
                        <div className="space-y-1.5 sm:col-span-2">
                          <Label className="text-xs uppercase tracking-[0.08em] text-muted-foreground">
                            Estabilidade de rendimento
                          </Label>
                          <div className="flex gap-2">
                            {(['stable', 'variable', 'freelance'] as const).map((opt) => (
                              <button
                                key={opt}
                                type="button"
                                onClick={() =>
                                  setEmergency((c) => ({ ...c, incomeStability: opt }))
                                }
                                className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                                  emergency.incomeStability === opt
                                    ? 'border-primary/60 bg-primary/10 text-primary'
                                    : 'border-border/60 bg-background/40 text-muted-foreground hover:text-foreground'
                                }`}
                              >
                                {opt === 'stable'
                                  ? 'Estavel'
                                  : opt === 'variable'
                                    ? 'Variavel'
                                    : 'Freelance'}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <ToolResultPanel>
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-foreground">Analise do fundo</p>
                        <StatusBadge
                          status={emergencyResult.status}
                          labels={{ good: 'Protegido', attention: 'Parcial', risk: 'Insuficiente' }}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <ResultRow
                          label="Meses recomendados"
                          value={`${emergencyResult.recommendedMonths} meses`}
                        />
                        <ResultRow
                          label="Montante recomendado"
                          value={formatCurrencyPt(emergencyResult.recommendedAmount)}
                          highlight
                        />
                        <ResultRow
                          label="Cobertura atual"
                          value={`${formatNumberPt(emergencyResult.currentCoverage, 1)} meses`}
                        />
                      </div>
                      {emergencyResult.gap > 0 ? (
                        <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 space-y-1">
                          <p className="text-sm font-medium text-amber-400">
                            Gap: {formatCurrencyPt(emergencyResult.gap)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Se poupares 200 EUR/mes para o fundo, fechas o gap em ~
                            {formatNumberPt(emergencyResult.gap / 200, 0)} meses.
                          </p>
                        </div>
                      ) : (
                        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3">
                          <p className="text-sm font-medium text-emerald-400 flex items-center gap-1.5">
                            <BadgeCheck className="h-4 w-4" /> Fundo de emergencia completo!
                          </p>
                        </div>
                      )}
                    </ToolResultPanel>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* ── Divida / Debt Payoff ── */}
              <TabsContent value="divida">
                <Card className="border border-border/60 bg-card/75">
                  <CardContent className="grid gap-5 p-6 lg:grid-cols-[1fr_1.1fr]">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                          <CreditCard className="h-4 w-4 text-primary" />
                        </div>
                        <h2 className="text-lg font-semibold text-foreground">
                          Liquidacao de Divida
                        </h2>
                      </div>
                      <div className="space-y-3">
                        {debtPayoff.debts.map((debt, idx) => (
                          <div
                            key={idx}
                            className="rounded-lg border border-border/60 bg-background/50 p-3 space-y-2"
                          >
                            <div className="flex items-center justify-between">
                              <Input
                                value={debt.name}
                                onChange={(e) => {
                                  const updated = [...debtPayoff.debts]
                                  updated[idx] = { ...updated[idx], name: e.target.value }
                                  setDebtPayoff((c) => ({ ...c, debts: updated }))
                                }}
                                className="h-7 text-xs font-medium border-0 bg-transparent p-0 focus-visible:ring-0"
                                placeholder="Nome da divida"
                              />
                              {debtPayoff.debts.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setDebtPayoff((c) => ({
                                      ...c,
                                      debts: c.debts.filter((_, i) => i !== idx),
                                    }))
                                  }
                                  className="text-xs text-muted-foreground hover:text-rose-500"
                                >
                                  Remover
                                </button>
                              )}
                            </div>
                            <div className="grid gap-2 grid-cols-3">
                              <NumericInput
                                id={`debt-${idx}-bal`}
                                label="Saldo"
                                value={debt.balance}
                                suffix="EUR"
                                onChange={(v) => {
                                  const updated = [...debtPayoff.debts]
                                  updated[idx] = { ...updated[idx], balance: v }
                                  setDebtPayoff((c) => ({ ...c, debts: updated }))
                                }}
                              />
                              <NumericInput
                                id={`debt-${idx}-rate`}
                                label="Taxa anual"
                                value={debt.interestRate}
                                step={0.1}
                                suffix="%"
                                onChange={(v) => {
                                  const updated = [...debtPayoff.debts]
                                  updated[idx] = { ...updated[idx], interestRate: v }
                                  setDebtPayoff((c) => ({ ...c, debts: updated }))
                                }}
                              />
                              <NumericInput
                                id={`debt-${idx}-min`}
                                label="Minimo / mes"
                                value={debt.minimumPayment}
                                suffix="EUR"
                                onChange={(v) => {
                                  const updated = [...debtPayoff.debts]
                                  updated[idx] = { ...updated[idx], minimumPayment: v }
                                  setDebtPayoff((c) => ({ ...c, debts: updated }))
                                }}
                              />
                            </div>
                          </div>
                        ))}
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setDebtPayoff((c) => ({
                                ...c,
                                debts: [
                                  ...c.debts,
                                  {
                                    name: `Divida ${c.debts.length + 1}`,
                                    balance: 1000,
                                    interestRate: 5,
                                    minimumPayment: 50,
                                  },
                                ],
                              }))
                            }
                          >
                            + Adicionar divida
                          </Button>
                        </div>
                        <NumericInput
                          id="debt-extra"
                          label="Pagamento extra mensal"
                          value={debtPayoff.extraMonthlyPayment}
                          suffix="EUR"
                          hint="Montante extra alem dos minimos (metodo avalanche)"
                          onChange={(v) => setDebtPayoff((c) => ({ ...c, extraMonthlyPayment: v }))}
                        />
                      </div>
                    </div>
                    <ToolResultPanel>
                      <p className="text-sm font-semibold text-foreground">Plano de liquidacao</p>
                      <div className="space-y-1.5">
                        <ResultRow
                          label="Divida total"
                          value={formatCurrencyPt(debtResult.totalDebt)}
                        />
                        <ResultRow
                          label="Pagamento minimo / mes"
                          value={formatCurrencyPt(debtResult.totalMinimumPayments)}
                        />
                      </div>
                      <div className="border-t border-border/30 pt-3 space-y-1.5">
                        <p className="text-xs font-medium text-muted-foreground">
                          Sem pagamento extra:
                        </p>
                        <ResultRow
                          label="Tempo para liquidar"
                          value={`${formatNumberPt(debtResult.monthsToPayoff / 12, 1)} anos (${debtResult.monthsToPayoff} meses)`}
                        />
                        <ResultRow
                          label="Total de juros pagos"
                          value={formatCurrencyPt(debtResult.totalInterestPaid)}
                        />
                      </div>
                      {debtPayoff.extraMonthlyPayment > 0 && (
                        <div className="border-t border-border/30 pt-3 space-y-1.5">
                          <p className="text-xs font-medium text-muted-foreground">
                            Com +{formatCurrencyPt(debtPayoff.extraMonthlyPayment)}/mes (avalanche):
                          </p>
                          <ResultRow
                            label="Tempo para liquidar"
                            value={`${formatNumberPt(debtResult.monthsWithExtra / 12, 1)} anos (${debtResult.monthsWithExtra} meses)`}
                          />
                          <ResultRow
                            label="Total de juros"
                            value={formatCurrencyPt(debtResult.totalInterestWithExtra)}
                          />
                        </div>
                      )}
                      {debtResult.interestSaved > 0 && (
                        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3">
                          <p className="text-sm font-medium text-emerald-400">
                            Poupas {formatCurrencyPt(debtResult.interestSaved)} em juros e liquidas{' '}
                            {formatNumberPt(
                              (debtResult.monthsToPayoff - debtResult.monthsWithExtra) / 12,
                              1,
                            )}{' '}
                            anos mais cedo!
                          </p>
                        </div>
                      )}
                    </ToolResultPanel>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Footer info card */}
            <Card className="border border-border/60 bg-card/70">
              <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <PiggyBank className="h-4 w-4 text-primary" />
                  Estas ferramentas partilham o motor de calculo do Raio-X Financeiro.
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="border-primary/40 bg-primary/10">
                    8 calculadoras
                  </Badge>
                  <Calculator className="h-4 w-4 text-muted-foreground" />
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
