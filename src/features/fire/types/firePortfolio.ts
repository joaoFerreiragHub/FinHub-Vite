export type FirePortfolioCurrency = 'EUR' | 'USD' | 'GBP'
export type FireTargetMethod = 'expenses' | 'passive_income' | 'target_amount'
export type FireAssetType = 'stock' | 'etf' | 'reit' | 'crypto' | 'bond' | 'cash'
export type FireSimulationScenario = 'optimistic' | 'base' | 'conservative' | 'bear'

export interface FireTargetConfig {
  method: FireTargetMethod
  monthlyExpenses?: number
  desiredMonthlyIncome?: number
  targetAmount?: number
  withdrawalRate: number
  inflationRate: number
}

export interface FirePortfolioSummary {
  holdingsCount: number
  totalInvested: number
  currentValue: number
}

export interface FirePortfolio {
  id: string
  userId: string
  name: string
  currency: FirePortfolioCurrency
  fireTarget: FireTargetConfig
  monthlyContribution: number
  contributionGrowthRate: number
  isDefault: boolean
  summary: FirePortfolioSummary
  createdAt: string | null
  updatedAt: string | null
}

export interface FirePortfolioHolding {
  id: string
  ticker: string
  assetType: FireAssetType
  name: string
  shares: number
  averageCost: number
  totalInvested: number
  monthlyAllocation: number
  allocationPercent: number
  currentPrice: number
  dividendYield: number
  dividendCAGR: number
  totalReturnCAGR: number
  sector?: string
  notes?: string
  addedAt: string | null
  createdAt: string | null
  updatedAt: string | null
}

export interface FirePortfolioDetail extends FirePortfolio {
  holdings: FirePortfolioHolding[]
}

export interface FirePagination {
  page: number
  limit: number
  total: number
  pages: number
}

export interface FirePortfolioListResponse {
  items: FirePortfolio[]
  pagination: FirePagination
}

export interface FireSuggestion {
  type: string
  message: string
}

export interface FireSimulationTimelinePoint {
  month: number
  date: string
  portfolioValue: number
  targetValue: number
  monthlyContribution: number
  monthlyPassiveIncome: number
  progressPct: number
}

export interface FireSimulationScenarioResult {
  scenario: FireSimulationScenario
  achieved: boolean
  monthsToFire: number | null
  yearsToFire: number | null
  fireDate: string | null
  finalPortfolioValue: number
  targetAtEnd: number
  projectedMonthlyPassiveIncome: number
  totalContributed: number
  timeline: FireSimulationTimelinePoint[]
}

export interface FireSimulationResult {
  portfolioId: string
  portfolioName: string
  currency: FirePortfolioCurrency
  assumptions: {
    monthlyContribution: number
    contributionGrowthRate: number
    drip: boolean
    includeInflation: boolean
    maxYears: number
    useHistoricalCalibration?: boolean
    historicalLookbackMonths?: number
    historicalCalibration?: {
      source: 'fmp_stable' | null
      attemptedHoldings: number
      calibratedHoldings: number
      reason?: string
      items: FireSimulationHistoricalCalibrationItem[]
    }
    whatIf?: {
      scenario: FireSimulationScenario
      contributionDelta: number
      annualReturnShock: number
      inflationShock: number
    } | null
    monteCarlo?: {
      scenario: FireSimulationScenario
      simulations: number
    } | null
  }
  fireTarget: FireTargetConfig
  scenarios: FireSimulationScenarioResult[]
  whatIf?: FireSimulationWhatIfResult | null
  monteCarlo?: FireSimulationMonteCarloResult | null
  suggestions: FireSuggestion[]
  generatedAt: string
}

export interface FirePortfolioListQuery {
  page?: number
  limit?: number
}

export interface FireSimulationCustomOverride {
  annualReturn?: number
  dividendYield?: number
  annualVolatility?: number
}

export interface FireSimulationWhatIfInput {
  enabled?: boolean
  scenario?: FireSimulationScenario
  contributionDelta?: number
  annualReturnShock?: number
  inflationShock?: number
}

export interface FireSimulationMonteCarloInput {
  enabled?: boolean
  scenario?: FireSimulationScenario
  simulations?: number
}

export interface FireSimulationInput {
  scenarios?: FireSimulationScenario[]
  maxYears?: number
  drip?: boolean
  includeInflation?: boolean
  useHistoricalCalibration?: boolean
  historicalLookbackMonths?: number
  customOverrides?: Record<string, FireSimulationCustomOverride>
  whatIf?: FireSimulationWhatIfInput
  monteCarlo?: FireSimulationMonteCarloInput
}

export interface FireSimulationHistoricalCalibrationItem {
  ticker: string
  assetType: FireAssetType
  status: 'calibrated' | 'fallback'
  annualReturn: number | null
  annualDividendYield: number | null
  annualVolatility: number | null
  lookbackMonths: number
  priceSamples: number
  monthlyReturnSamples: number
  dividendSamples: number
  reason?: string
}

export interface FireSimulationPercentiles {
  p10: number
  p25: number
  p50: number
  p75: number
  p90: number
}

export interface FireSimulationWhatIfResult {
  enabled: boolean
  scenario: FireSimulationScenario
  assumptions: {
    contributionDelta: number
    adjustedMonthlyContribution: number
    annualReturnShock: number
    inflationShock: number
  }
  baseline: FireSimulationScenarioResult
  adjusted: FireSimulationScenarioResult
  delta: {
    achievedChanged: boolean
    monthsToFire: number | null
    yearsToFire: number | null
    finalPortfolioValue: number
    projectedMonthlyPassiveIncome: number
    targetAtEnd: number
  }
}

export interface FireSimulationMonteCarloResult {
  enabled: boolean
  scenario: FireSimulationScenario
  simulations: number
  achievedRuns: number
  successProbabilityPct: number
  monthsToFirePercentiles: FireSimulationPercentiles | null
  yearsToFirePercentiles: FireSimulationPercentiles | null
  finalPortfolioValuePercentiles: FireSimulationPercentiles
  timelineSuccessProbability: Array<{
    month: number
    years: number
    date: string
    probabilityPct: number
  }>
}

export interface CreateFirePortfolioInput {
  name: string
  currency?: FirePortfolioCurrency
  fireTarget: FireTargetConfig
  monthlyContribution?: number
  contributionGrowthRate?: number
  isDefault?: boolean
}

export interface UpdateFirePortfolioInput {
  name?: string
  currency?: FirePortfolioCurrency
  fireTarget?: FireTargetConfig
  monthlyContribution?: number
  contributionGrowthRate?: number
  isDefault?: boolean
}

export interface CreateFireHoldingInput {
  ticker: string
  assetType: FireAssetType
  name: string
  shares: number
  averageCost: number
  monthlyAllocation?: number
  allocationPercent?: number
  currentPrice?: number
  dividendYield?: number
  dividendCAGR?: number
  totalReturnCAGR?: number
  sector?: string
  notes?: string
}

export interface UpdateFireHoldingInput {
  ticker?: string
  assetType?: FireAssetType
  name?: string
  shares?: number
  averageCost?: number
  monthlyAllocation?: number
  allocationPercent?: number
  currentPrice?: number
  dividendYield?: number
  dividendCAGR?: number
  totalReturnCAGR?: number
  sector?: string
  notes?: string
}

export interface DeleteFireEntityResult {
  deleted: boolean
  portfolioId?: string
  holdingId?: string
}
