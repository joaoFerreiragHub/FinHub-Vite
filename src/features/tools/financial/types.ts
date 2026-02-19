export interface RaioXInput {
  monthlyIncome: number
  monthlyExpenses: number
  monthlySavings: number
  monthlyInvestments: number
  monthlyDebtPayments: number
  totalDebt: number
  currentEmergencyFund: number
  currentNetWorth: number
  annualReturnRate: number
  annualInflationRate: number
  effectiveTaxRate: number
  yearsToGoal: number
  fireAnnualExpenses: number
  fireWithdrawalRate: number
}

export interface ProjectionScenario {
  name: string
  annualRate: number
  finalValue: number
}

export interface HealthMetric {
  key: string
  label: string
  value: number
  status: 'good' | 'attention' | 'risk'
  helper: string
}

export interface WhatIfScenario {
  key: string
  label: string
  description: string
  projectedNetWorth: number
  deltaVsBase: number
  estimatedYearsToFire: number | null
}

export interface RaioXSnapshot {
  id: string
  date: string
  input: RaioXInput
  summary: {
    score: number
    savingsRate: number
    debtToIncomeRatio: number
    investmentRate: number
    emergencyFundMonths: number
    fireProgress: number
    projectedNetWorthAfterTax: number
    estimatedYearsToFire: number | null
  }
}

export interface RaioXSummary {
  monthlyFreeCashFlow: number
  savingsRate: number
  debtToIncomeRatio: number
  investmentRate: number
  emergencyFundMonths: number
  fireTargetToday: number
  fireTargetAdjusted: number
  fireProgress: number
  projectedNetWorthBase: number
  projectedNetWorthAfterTax: number
  projectedNetWorthReal: number
  estimatedYearsToFire: number | null
  score: number
  metrics: HealthMetric[]
  scenarios: ProjectionScenario[]
  whatIfScenarios: WhatIfScenario[]
  recommendations: string[]
}

export interface InvestmentProjectionInput {
  initialAmount: number
  monthlyContribution: number
  annualRate: number
  years: number
}

export interface InvestmentProjectionResult {
  finalBalance: number
  totalContributions: number
  totalInterest: number
}

export interface RetirementInput {
  monthlyExpensesToday: number
  yearsToRetirement: number
  inflationRate: number
  withdrawalRate: number
  currentCapital: number
  expectedReturnRate: number
}

export interface RetirementResult {
  annualNeedAtRetirement: number
  targetCapital: number
  requiredMonthlyContribution: number
}

export interface RoiInput {
  initialCost: number
  currentValue: number
  additionalCashFlow: number
  months: number
}

export interface RoiResult {
  netGain: number
  roi: number
  annualizedRoi: number
}

export interface BudgetInput {
  income: number
  fixedExpenses: number
  variableExpenses: number
  debtPayments: number
  investments: number
}

export interface BudgetResult {
  totalExpenses: number
  freeCashFlow: number
  savingsRate: number
  recommendedEmergencyFund: number
  rule503020: {
    needsPct: number
    wantsPct: number
    savingsPct: number
    status: 'good' | 'attention' | 'risk'
  }
}

export interface EmergencyFundInput {
  monthlyExpenses: number
  monthlyDebtPayments: number
  currentFund: number
  dependents: number
  incomeStability: 'stable' | 'variable' | 'freelance'
}

export interface EmergencyFundResult {
  recommendedMonths: number
  recommendedAmount: number
  currentCoverage: number
  gap: number
  status: 'good' | 'attention' | 'risk'
}

export interface DebtPayoffInput {
  debts: Array<{
    name: string
    balance: number
    interestRate: number
    minimumPayment: number
  }>
  extraMonthlyPayment: number
}

export interface DebtPayoffResult {
  totalDebt: number
  totalMinimumPayments: number
  monthsToPayoff: number
  totalInterestPaid: number
  monthsWithExtra: number
  totalInterestWithExtra: number
  interestSaved: number
}
