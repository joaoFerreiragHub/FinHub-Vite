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
  }
  fireTarget: FireTargetConfig
  scenarios: FireSimulationScenarioResult[]
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
}

export interface FireSimulationInput {
  scenarios?: FireSimulationScenario[]
  maxYears?: number
  drip?: boolean
  includeInflation?: boolean
  customOverrides?: Record<string, FireSimulationCustomOverride>
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
