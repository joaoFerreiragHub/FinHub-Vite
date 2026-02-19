import type {
  BudgetInput,
  BudgetResult,
  DebtPayoffInput,
  DebtPayoffResult,
  EmergencyFundInput,
  EmergencyFundResult,
  HealthMetric,
  InvestmentProjectionInput,
  InvestmentProjectionResult,
  ProjectionScenario,
  RaioXInput,
  RaioXSummary,
  RetirementInput,
  RetirementResult,
  RoiInput,
  RoiResult,
  WhatIfScenario,
} from './types'

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

const safeNumber = (value: number) => (Number.isFinite(value) ? value : 0)

const safeDivide = (numerator: number, denominator: number) => {
  if (!denominator) return 0
  return numerator / denominator
}

export const defaultRaioXInput: RaioXInput = {
  monthlyIncome: 2500,
  monthlyExpenses: 1400,
  monthlySavings: 350,
  monthlyInvestments: 250,
  monthlyDebtPayments: 180,
  totalDebt: 12000,
  currentEmergencyFund: 3500,
  currentNetWorth: 15000,
  annualReturnRate: 7,
  annualInflationRate: 2.5,
  effectiveTaxRate: 18,
  yearsToGoal: 20,
  fireAnnualExpenses: 22000,
  fireWithdrawalRate: 4,
}

export const formatCurrencyPt = (value: number) =>
  new Intl.NumberFormat('pt-PT', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(safeNumber(value))

export const formatNumberPt = (value: number, fractionDigits = 1) =>
  new Intl.NumberFormat('pt-PT', {
    minimumFractionDigits: 0,
    maximumFractionDigits: fractionDigits,
  }).format(safeNumber(value))

export const formatPercentPt = (value: number, fractionDigits = 1) =>
  `${formatNumberPt(value, fractionDigits)}%`

export function calculateInvestmentProjection(
  input: InvestmentProjectionInput,
): InvestmentProjectionResult {
  const initialAmount = Math.max(0, safeNumber(input.initialAmount))
  const monthlyContribution = Math.max(0, safeNumber(input.monthlyContribution))
  const annualRate = safeNumber(input.annualRate)
  const years = Math.max(0, safeNumber(input.years))
  const months = Math.round(years * 12)
  const monthlyRate = annualRate / 100 / 12

  let balance = initialAmount
  let totalContributions = initialAmount

  for (let month = 0; month < months; month += 1) {
    balance += monthlyContribution
    totalContributions += monthlyContribution
    balance *= 1 + monthlyRate
  }

  const totalInterest = balance - totalContributions

  return {
    finalBalance: Math.max(0, balance),
    totalContributions: Math.max(0, totalContributions),
    totalInterest: Math.max(0, totalInterest),
  }
}

export function estimateMonthsToTarget(params: {
  initialAmount: number
  monthlyContribution: number
  annualRate: number
  targetAmount: number
  maxYears?: number
}): number | null {
  const initialAmount = Math.max(0, safeNumber(params.initialAmount))
  const monthlyContribution = Math.max(0, safeNumber(params.monthlyContribution))
  const annualRate = safeNumber(params.annualRate)
  const targetAmount = Math.max(0, safeNumber(params.targetAmount))
  const maxYears = params.maxYears ?? 80
  const maxMonths = Math.max(1, Math.round(maxYears * 12))

  if (initialAmount >= targetAmount) return 0
  if (monthlyContribution <= 0 && annualRate <= 0) return null

  const monthlyRate = annualRate / 100 / 12
  let balance = initialAmount

  for (let month = 1; month <= maxMonths; month += 1) {
    balance += monthlyContribution
    balance *= 1 + monthlyRate
    if (balance >= targetAmount) return month
  }

  return null
}

export function calculateRetirementPlan(input: RetirementInput): RetirementResult {
  const monthlyExpensesToday = Math.max(0, safeNumber(input.monthlyExpensesToday))
  const yearsToRetirement = Math.max(0, safeNumber(input.yearsToRetirement))
  const inflationRate = safeNumber(input.inflationRate)
  const withdrawalRate = clamp(safeNumber(input.withdrawalRate), 1, 10)
  const currentCapital = Math.max(0, safeNumber(input.currentCapital))
  const expectedReturnRate = safeNumber(input.expectedReturnRate)

  const annualNeedAtRetirement =
    monthlyExpensesToday * 12 * Math.pow(1 + inflationRate / 100, yearsToRetirement)
  const targetCapital = annualNeedAtRetirement / (withdrawalRate / 100)

  const months = yearsToRetirement * 12
  const monthlyRate = expectedReturnRate / 100 / 12
  const currentCapitalFutureValue = currentCapital * Math.pow(1 + monthlyRate, months)
  const numerator = Math.max(0, targetCapital - currentCapitalFutureValue)
  const denominator =
    monthlyRate === 0 ? months : (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate
  const requiredMonthlyContribution = denominator > 0 ? numerator / denominator : 0

  return {
    annualNeedAtRetirement,
    targetCapital,
    requiredMonthlyContribution: Math.max(0, requiredMonthlyContribution),
  }
}

export function calculateRoi(input: RoiInput): RoiResult {
  const initialCost = Math.max(0, safeNumber(input.initialCost))
  const currentValue = Math.max(0, safeNumber(input.currentValue))
  const additionalCashFlow = safeNumber(input.additionalCashFlow)
  const months = Math.max(1, safeNumber(input.months))

  const finalValue = currentValue + additionalCashFlow
  const netGain = finalValue - initialCost
  const roi = initialCost > 0 ? (netGain / initialCost) * 100 : 0
  const annualizedBase = Math.max(0.0001, 1 + roi / 100)
  const annualizedRoi = Math.pow(annualizedBase, 12 / months) - 1

  return {
    netGain,
    roi,
    annualizedRoi: annualizedRoi * 100,
  }
}

export function compareInvestments(options: {
  a: InvestmentProjectionInput
  b: InvestmentProjectionInput
}) {
  const resultA = calculateInvestmentProjection(options.a)
  const resultB = calculateInvestmentProjection(options.b)
  const delta = resultA.finalBalance - resultB.finalBalance
  const deltaPct = safeDivide(delta, resultB.finalBalance) * 100

  return {
    resultA,
    resultB,
    delta,
    deltaPct,
  }
}

export function calculateBudgetSummary(input: BudgetInput): BudgetResult {
  const income = Math.max(0, safeNumber(input.income))
  const fixedExpenses = Math.max(0, safeNumber(input.fixedExpenses))
  const variableExpenses = Math.max(0, safeNumber(input.variableExpenses))
  const debtPayments = Math.max(0, safeNumber(input.debtPayments))
  const investments = Math.max(0, safeNumber(input.investments))

  const totalExpenses = fixedExpenses + variableExpenses + debtPayments + investments
  const freeCashFlow = income - totalExpenses
  const savingsRate = safeDivide(investments + Math.max(0, freeCashFlow), income) * 100
  const recommendedEmergencyFund = (fixedExpenses + variableExpenses + debtPayments) * 6

  // 50/30/20 rule analysis
  const needsPct = safeDivide(fixedExpenses + debtPayments, income) * 100
  const wantsPct = safeDivide(variableExpenses, income) * 100
  const savingsPct = safeDivide(investments + Math.max(0, freeCashFlow), income) * 100
  const ruleStatus: 'good' | 'attention' | 'risk' =
    needsPct <= 55 && wantsPct <= 35 && savingsPct >= 15
      ? 'good'
      : needsPct <= 65 && savingsPct >= 10
        ? 'attention'
        : 'risk'

  return {
    totalExpenses,
    freeCashFlow,
    savingsRate,
    recommendedEmergencyFund,
    rule503020: {
      needsPct,
      wantsPct,
      savingsPct,
      status: ruleStatus,
    },
  }
}

export function calculateEmergencyFund(input: EmergencyFundInput): EmergencyFundResult {
  const monthlyExpenses = Math.max(0, safeNumber(input.monthlyExpenses))
  const monthlyDebtPayments = Math.max(0, safeNumber(input.monthlyDebtPayments))
  const currentFund = Math.max(0, safeNumber(input.currentFund))
  const dependents = Math.max(0, safeNumber(input.dependents))

  // Recommended months based on income stability + dependents
  let baseMonths = 6
  if (input.incomeStability === 'variable') baseMonths = 9
  if (input.incomeStability === 'freelance') baseMonths = 12
  const recommendedMonths = baseMonths + Math.min(dependents, 4) * 1

  const monthlyNeed = monthlyExpenses + monthlyDebtPayments
  const recommendedAmount = monthlyNeed * recommendedMonths
  const currentCoverage = safeDivide(currentFund, monthlyNeed)
  const gap = Math.max(0, recommendedAmount - currentFund)

  const status: 'good' | 'attention' | 'risk' =
    currentCoverage >= recommendedMonths ? 'good' : currentCoverage >= 3 ? 'attention' : 'risk'

  return {
    recommendedMonths,
    recommendedAmount,
    currentCoverage,
    gap,
    status,
  }
}

export function calculateDebtPayoff(input: DebtPayoffInput): DebtPayoffResult {
  const debts = input.debts.map((d) => ({
    name: d.name,
    balance: Math.max(0, safeNumber(d.balance)),
    interestRate: Math.max(0, safeNumber(d.interestRate)),
    minimumPayment: Math.max(0, safeNumber(d.minimumPayment)),
  }))
  const extraMonthlyPayment = Math.max(0, safeNumber(input.extraMonthlyPayment))

  const totalDebt = debts.reduce((sum, d) => sum + d.balance, 0)
  const totalMinimumPayments = debts.reduce((sum, d) => sum + d.minimumPayment, 0)

  if (totalDebt <= 0) {
    return {
      totalDebt: 0,
      totalMinimumPayments: 0,
      monthsToPayoff: 0,
      totalInterestPaid: 0,
      monthsWithExtra: 0,
      totalInterestWithExtra: 0,
      interestSaved: 0,
    }
  }

  // Simulate minimum-only payoff (avalanche: highest interest first)
  const simulatePayoff = (extra: number) => {
    const balances = debts.map((d) => d.balance)
    let totalInterest = 0
    let months = 0
    const maxMonths = 600 // 50 years cap

    while (months < maxMonths && balances.some((b) => b > 0.01)) {
      months += 1
      let availableExtra = extra

      // Pay interest and minimums first
      for (let i = 0; i < debts.length; i += 1) {
        if (balances[i] <= 0) continue
        const monthlyInterest = balances[i] * (debts[i].interestRate / 100 / 12)
        totalInterest += monthlyInterest
        balances[i] += monthlyInterest
        const payment = Math.min(balances[i], debts[i].minimumPayment)
        balances[i] -= payment
      }

      // Apply extra to highest-interest debt first (avalanche)
      const sortedIndices = debts
        .map((_, i) => i)
        .filter((i) => balances[i] > 0)
        .sort((a, b) => debts[b].interestRate - debts[a].interestRate)

      for (const i of sortedIndices) {
        if (availableExtra <= 0) break
        const extraPayment = Math.min(balances[i], availableExtra)
        balances[i] -= extraPayment
        availableExtra -= extraPayment
      }
    }
    return { months, totalInterest }
  }

  const withoutExtra = simulatePayoff(0)
  const withExtra = simulatePayoff(extraMonthlyPayment)

  return {
    totalDebt,
    totalMinimumPayments,
    monthsToPayoff: withoutExtra.months,
    totalInterestPaid: withoutExtra.totalInterest,
    monthsWithExtra: withExtra.months,
    totalInterestWithExtra: withExtra.totalInterest,
    interestSaved: Math.max(0, withoutExtra.totalInterest - withExtra.totalInterest),
  }
}

function getMetricStatus(
  value: number,
  warningThreshold: number,
  goodThreshold: number,
): 'good' | 'attention' | 'risk' {
  if (value >= goodThreshold) return 'good'
  if (value >= warningThreshold) return 'attention'
  return 'risk'
}

function buildMetrics(
  summary: Omit<RaioXSummary, 'metrics' | 'recommendations' | 'score' | 'scenarios'>,
): HealthMetric[] {
  const emergencyStatus = getMetricStatus(summary.emergencyFundMonths, 3, 6)
  const savingsStatus = getMetricStatus(summary.savingsRate, 10, 20)
  const investmentStatus = getMetricStatus(summary.investmentRate, 8, 15)
  const fireStatus = getMetricStatus(summary.fireProgress, 15, 40)
  const dtiInvertedStatus =
    summary.debtToIncomeRatio <= 30
      ? 'good'
      : summary.debtToIncomeRatio <= 40
        ? 'attention'
        : 'risk'

  return [
    {
      key: 'savings-rate',
      label: 'Taxa de poupanca',
      value: summary.savingsRate,
      status: savingsStatus,
      helper: 'Objetivo recomendado: >= 20%',
    },
    {
      key: 'investment-rate',
      label: 'Taxa de investimento',
      value: summary.investmentRate,
      status: investmentStatus,
      helper: 'Objetivo recomendado: >= 15%',
    },
    {
      key: 'emergency-fund',
      label: 'Fundo de emergencia (meses)',
      value: summary.emergencyFundMonths,
      status: emergencyStatus,
      helper: 'Objetivo recomendado: 6 a 12 meses',
    },
    {
      key: 'dti',
      label: 'DTI (divida/rendimento)',
      value: summary.debtToIncomeRatio,
      status: dtiInvertedStatus,
      helper: 'Objetivo recomendado: <= 30%',
    },
    {
      key: 'fire-progress',
      label: 'Progresso FIRE',
      value: summary.fireProgress,
      status: fireStatus,
      helper: 'Quanto maior, mais perto da independencia',
    },
  ]
}

function buildRecommendations(
  input: RaioXInput,
  summary: Omit<RaioXSummary, 'metrics' | 'recommendations' | 'score' | 'scenarios'>,
): string[] {
  const recommendations: string[] = []

  if (summary.savingsRate < 20) {
    recommendations.push('Aumentar a taxa de poupanca para pelo menos 20% do rendimento mensal.')
  }

  if (summary.debtToIncomeRatio > 35) {
    recommendations.push('Reduzir o peso da divida: objetivo de DTI abaixo de 30%.')
  }

  if (summary.emergencyFundMonths < 6) {
    recommendations.push('Priorizar o fundo de emergencia ate atingir 6 meses de despesas.')
  }

  if (summary.investmentRate < 15) {
    recommendations.push('Elevar os aportes em investimento para acelerar o progresso FIRE.')
  }

  if (summary.monthlyFreeCashFlow < 0) {
    recommendations.push(
      'O fluxo mensal esta negativo. Rever despesas variaveis e compromissos de curto prazo.',
    )
  }

  if (
    summary.estimatedYearsToFire !== null &&
    summary.estimatedYearsToFire > input.yearsToGoal + 5
  ) {
    recommendations.push(
      'A projecao atual afasta-se da meta FIRE desejada. Ajustar aportes, prazo ou retorno esperado.',
    )
  }

  if (recommendations.length === 0) {
    recommendations.push(
      'Boa base financeira. Mantem consistencia e revisao trimestral dos objetivos.',
    )
  }

  return recommendations
}

function buildScore(metrics: HealthMetric[]) {
  const toPoints = (metric: HealthMetric) => {
    if (metric.status === 'good') return 100
    if (metric.status === 'attention') return 65
    return 35
  }

  const weighted = {
    'savings-rate': 0.25,
    'investment-rate': 0.2,
    'emergency-fund': 0.2,
    dti: 0.2,
    'fire-progress': 0.15,
  }

  const total = metrics.reduce((acc, metric) => {
    const weight = weighted[metric.key as keyof typeof weighted] ?? 0
    return acc + toPoints(metric) * weight
  }, 0)

  return Math.round(clamp(total, 0, 100))
}

function buildWhatIfScenarios(
  input: RaioXInput,
  afterTaxRate: number,
  baseProjectedNetWorth: number,
  fireTargetAdjusted: number,
): WhatIfScenario[] {
  const currentNetWorth = Math.max(0, safeNumber(input.currentNetWorth))
  const monthlyInvestments = Math.max(0, safeNumber(input.monthlyInvestments))
  const monthlySavings = Math.max(0, safeNumber(input.monthlySavings))
  const monthlyDebtPayments = Math.max(0, safeNumber(input.monthlyDebtPayments))
  const monthlyIncome = Math.max(0, safeNumber(input.monthlyIncome))
  const yearsToGoal = Math.max(1, safeNumber(input.yearsToGoal))

  const baseContribution = monthlySavings + monthlyInvestments

  // 1. Sem divida — debt payments redirected to investments
  const noDebtContribution = baseContribution + monthlyDebtPayments
  const noDebtProjection = calculateInvestmentProjection({
    initialAmount: currentNetWorth,
    monthlyContribution: noDebtContribution,
    annualRate: afterTaxRate,
    years: yearsToGoal,
  })
  const noDebtFireMonths = estimateMonthsToTarget({
    initialAmount: currentNetWorth,
    monthlyContribution: noDebtContribution,
    annualRate: afterTaxRate,
    targetAmount: fireTargetAdjusted,
  })

  // 2. +20% rendimento — extra income goes to investments
  const incomeBoost = monthlyIncome * 0.2
  const boostContribution = baseContribution + incomeBoost
  const boostProjection = calculateInvestmentProjection({
    initialAmount: currentNetWorth,
    monthlyContribution: boostContribution,
    annualRate: afterTaxRate,
    years: yearsToGoal,
  })
  const boostFireMonths = estimateMonthsToTarget({
    initialAmount: currentNetWorth,
    monthlyContribution: boostContribution,
    annualRate: afterTaxRate,
    targetAmount: fireTargetAdjusted,
  })

  // 3. Lifestyle inflation — expenses grow 3%/year, reducing available contribution
  const annualLifestyleInflation = 0.03
  let lifestyleBalance = currentNetWorth
  const monthlyRate = afterTaxRate / 100 / 12
  const monthlyExpenses = Math.max(0, safeNumber(input.monthlyExpenses))
  for (let year = 0; year < yearsToGoal; year += 1) {
    const inflatedExpenses = monthlyExpenses * Math.pow(1 + annualLifestyleInflation, year)
    const adjustedContribution = Math.max(
      0,
      baseContribution - (inflatedExpenses - monthlyExpenses),
    )
    for (let month = 0; month < 12; month += 1) {
      lifestyleBalance += adjustedContribution
      lifestyleBalance *= 1 + monthlyRate
    }
  }
  const lifestyleFireMonths = estimateMonthsToTarget({
    initialAmount: currentNetWorth,
    monthlyContribution: Math.max(
      0,
      baseContribution - monthlyExpenses * annualLifestyleInflation * (yearsToGoal / 2),
    ),
    annualRate: afterTaxRate,
    targetAmount: fireTargetAdjusted,
  })

  return [
    {
      key: 'no-debt',
      label: 'Sem divida',
      description: 'Se redirecionasses as prestacoes de divida para investimento.',
      projectedNetWorth: noDebtProjection.finalBalance,
      deltaVsBase: noDebtProjection.finalBalance - baseProjectedNetWorth,
      estimatedYearsToFire: noDebtFireMonths === null ? null : noDebtFireMonths / 12,
    },
    {
      key: 'income-boost',
      label: '+20% rendimento',
      description: 'Se o rendimento mensal aumentasse 20%, investindo o extra.',
      projectedNetWorth: boostProjection.finalBalance,
      deltaVsBase: boostProjection.finalBalance - baseProjectedNetWorth,
      estimatedYearsToFire: boostFireMonths === null ? null : boostFireMonths / 12,
    },
    {
      key: 'lifestyle-inflation',
      label: 'Inflacao de estilo de vida',
      description: 'Se as despesas crescessem 3% ao ano (lifestyle creep).',
      projectedNetWorth: Math.max(0, lifestyleBalance),
      deltaVsBase: lifestyleBalance - baseProjectedNetWorth,
      estimatedYearsToFire: lifestyleFireMonths === null ? null : lifestyleFireMonths / 12,
    },
  ]
}

export function buildRaioXSummary(input: RaioXInput): RaioXSummary {
  const monthlyIncome = Math.max(0, safeNumber(input.monthlyIncome))
  const monthlyExpenses = Math.max(0, safeNumber(input.monthlyExpenses))
  const monthlySavings = Math.max(0, safeNumber(input.monthlySavings))
  const monthlyInvestments = Math.max(0, safeNumber(input.monthlyInvestments))
  const monthlyDebtPayments = Math.max(0, safeNumber(input.monthlyDebtPayments))
  const currentEmergencyFund = Math.max(0, safeNumber(input.currentEmergencyFund))
  const currentNetWorth = Math.max(0, safeNumber(input.currentNetWorth))
  const yearsToGoal = Math.max(1, safeNumber(input.yearsToGoal))
  const annualReturnRate = safeNumber(input.annualReturnRate)
  const annualInflationRate = safeNumber(input.annualInflationRate)
  const effectiveTaxRate = clamp(safeNumber(input.effectiveTaxRate), 0, 60)
  const fireWithdrawalRate = clamp(safeNumber(input.fireWithdrawalRate), 1, 10)
  const fireAnnualExpenses = Math.max(0, safeNumber(input.fireAnnualExpenses))
  const monthlyFreeCashFlow =
    monthlyIncome - monthlyExpenses - monthlySavings - monthlyInvestments - monthlyDebtPayments
  const totalMonthlyContribution = monthlySavings + monthlyInvestments

  const savingsRate = safeDivide(monthlySavings + monthlyInvestments, monthlyIncome) * 100
  const debtToIncomeRatio = safeDivide(monthlyDebtPayments, monthlyIncome) * 100
  const investmentRate = safeDivide(monthlyInvestments, monthlyIncome) * 100
  const emergencyFundMonths = safeDivide(currentEmergencyFund, monthlyExpenses)

  const fireTargetToday = fireAnnualExpenses / (fireWithdrawalRate / 100)
  const fireTargetAdjusted = fireTargetToday * Math.pow(1 + annualInflationRate / 100, yearsToGoal)
  const fireProgress = safeDivide(currentNetWorth, fireTargetToday) * 100

  const baseProjection = calculateInvestmentProjection({
    initialAmount: currentNetWorth,
    monthlyContribution: totalMonthlyContribution,
    annualRate: annualReturnRate,
    years: yearsToGoal,
  })

  const afterTaxRate = annualReturnRate * (1 - effectiveTaxRate / 100)
  const afterTaxProjection = calculateInvestmentProjection({
    initialAmount: currentNetWorth,
    monthlyContribution: totalMonthlyContribution,
    annualRate: afterTaxRate,
    years: yearsToGoal,
  })

  const realRate = ((1 + afterTaxRate / 100) / (1 + annualInflationRate / 100) - 1) * 100
  const realProjection = calculateInvestmentProjection({
    initialAmount: currentNetWorth,
    monthlyContribution: totalMonthlyContribution,
    annualRate: realRate,
    years: yearsToGoal,
  })

  const conservativeRate = Math.max(afterTaxRate - 2, 0.5)
  const optimisticRate = afterTaxRate + 2

  const scenarios: ProjectionScenario[] = [
    {
      name: 'Conservador',
      annualRate: conservativeRate,
      finalValue: calculateInvestmentProjection({
        initialAmount: currentNetWorth,
        monthlyContribution: totalMonthlyContribution,
        annualRate: conservativeRate,
        years: yearsToGoal,
      }).finalBalance,
    },
    {
      name: 'Base',
      annualRate: afterTaxRate,
      finalValue: afterTaxProjection.finalBalance,
    },
    {
      name: 'Otimista',
      annualRate: optimisticRate,
      finalValue: calculateInvestmentProjection({
        initialAmount: currentNetWorth,
        monthlyContribution: totalMonthlyContribution,
        annualRate: optimisticRate,
        years: yearsToGoal,
      }).finalBalance,
    },
  ]

  const estimatedMonthsToFire = estimateMonthsToTarget({
    initialAmount: currentNetWorth,
    monthlyContribution: totalMonthlyContribution,
    annualRate: afterTaxRate,
    targetAmount: fireTargetAdjusted,
  })

  const summaryWithoutLists = {
    monthlyFreeCashFlow,
    savingsRate,
    debtToIncomeRatio,
    investmentRate,
    emergencyFundMonths,
    fireTargetToday,
    fireTargetAdjusted,
    fireProgress,
    projectedNetWorthBase: baseProjection.finalBalance,
    projectedNetWorthAfterTax: afterTaxProjection.finalBalance,
    projectedNetWorthReal: realProjection.finalBalance,
    estimatedYearsToFire: estimatedMonthsToFire === null ? null : estimatedMonthsToFire / 12,
  }

  const metrics = buildMetrics(summaryWithoutLists)
  const recommendations = buildRecommendations(input, summaryWithoutLists)
  const score = buildScore(metrics)
  const whatIfScenarios = buildWhatIfScenarios(
    input,
    afterTaxRate,
    afterTaxProjection.finalBalance,
    fireTargetAdjusted,
  )

  return {
    ...summaryWithoutLists,
    score,
    metrics,
    scenarios,
    whatIfScenarios,
    recommendations,
  }
}
