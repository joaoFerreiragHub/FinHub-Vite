export interface PeerQuote {
  symbol: string
  name: string
  price: number
  changesPercentage: number | null
}

export interface Alert {
  title: string
  description: string
  severity: 'low' | 'medium' | 'high'
}

export interface ScoreData {
  metric: string
  value: number
}

export type QuickMetricStatus =
  | 'ok'
  | 'calculated'
  | 'nao_aplicavel'
  | 'sem_dado_atual'
  | 'erro_fonte'

export type QuickMetricPriority = 'core' | 'optional' | 'nao_aplicavel'

export type QuickMetricCategory =
  | 'crescimento'
  | 'rentabilidade'
  | 'retorno_capital'
  | 'multiplos'
  | 'estrutura_capital'
  | 'risco'

export type QuickMetricUnit = 'ratio' | 'percent' | 'currency' | 'score'
export type QuickMetricPeriod = 'TTM' | 'FY' | 'Q' | 'MIXED'
export type QuickAnalysisSector =
  | 'Technology'
  | 'Communication Services'
  | 'Healthcare'
  | 'Financial Services'
  | 'Real Estate'
  | 'Industrials'
  | 'Energy'
  | 'Consumer Defensive'
  | 'Consumer Cyclical'
  | 'Basic Materials'
  | 'Utilities'

export interface QuickMetricDefinition {
  key: string
  label: string
  category: QuickMetricCategory
  unit: QuickMetricUnit
  dataPeriod: QuickMetricPeriod
  primarySources: string[]
  fallbackSources: string[]
  formula?: string
  sectorPolicy?: Record<QuickAnalysisSector, QuickMetricPriority>
  sectorPriority?: QuickMetricPriority
}

export interface QuickMetricState {
  status: QuickMetricStatus
  value: string | null
  source: string | null
  dataPeriod: QuickMetricPeriod | null
  asOf: string
  reason?: string
  benchmarkValue?: string | null
  benchmarkSource?: string | null
  benchmarkDataPeriod?: QuickMetricPeriod | null
  sectorPriority?: QuickMetricPriority
  requiredForSector?: boolean
}

export interface StockData {
  // Básicos
  symbol: string
  name: string // substitui companyName
  image?: string
  sector: string // substitui 'setor'
  sectorRaw?: string
  analysisSectorReason?: string
  industry: string
  exchange: string
  pais: string
  price: number // substitui 'preco'
  marketCap: string
  enterpriseValue: string
  companyName: string // substitui 'nomeEmpresa'
  // Scores e Valuation
  valuationGrade: 'A' | 'B' | 'C' | 'D' | 'F'
  qualityScore: number // 0-10
  growthScore: number // 0-10
  riskScore: number // 0-10

  // Valuation
  eps: string
  pe: string
  pegRatio: string
  dcf: string
  leveredDCF: string
  freeCashFlow: string

  // Rentabilidade
  ebitda: string
  lucroLiquido: string
  margemEbitda: string
  margemBruta: string
  margemLiquida: string
  netProfitMargin: string
  roe: string
  roic: string
  cagrEps: string
  epsGrowth5Y: string
  ebitdaGrowth5Y: string

  // Dividendos
  dividendYield: string
  dividend_pershare: string
  payoutRatio: string

  // Saúde financeira
  debtToEquity: string
  currentRatio: string
  cash: string
  interestCoverage: string

  // Dívida
  netDebt: string
  totalDebt: string
  interestExpense: string
  cashRatio: string
  debtToEBITDA: string
  netDebtToEBITDA: string

  // Riscos e Custos
  riskFreeRate: string
  marketRiskPremium: string
  beta: string
  costOfEquity: string
  costOfDebt: string
  effectiveTaxRate: string
  wacc: string

  // Crescimento
  receita: string
  receitaPorAcao: string
  receitaCagr3y: string
  receitaGrowth5y: string
  lucro: string
  lucroPorAcao: string
  lucroCagr3y: string
  lucroGrowth5y: string

  // Institucional
  ceo: string
  fundacao: string
  employees: string

  // Extras da nova API
  description: string
  website: string
  ipoDate: string
  address: string
  indicadores: Record<string, string>
  radarData: ScoreData[]
  radarPeers: {
    symbol: string
    radar: ScoreData[]
  }[]

  alerts: Alert[]
  peers: string[]
  peersQuotes: PeerQuote[]

  benchmarkComparisons?: Record<string, string>
  benchmarkMetadata?: Record<string, { source: string; sampleSize?: number }>
  benchmarkContext?: {
    asOf: string
    sector: string
    industry: string
    peerCount: number
    googleAttempted: boolean
    googleAvailable: boolean
    yahooFallbackUsed?: boolean
    fallbackMetrics: number
    primarySource: 'dynamic' | 'fallback' | 'mixed'
  }
  quickMetricContractVersion?: 'p3.0'
  quickMetricCatalog?: QuickMetricDefinition[]
  quickMetricStates?: Record<string, QuickMetricState>
  quickMetricIngestion?: {
    currentDataPeriodRaw: string | null
    currentDataPeriodNormalized: QuickMetricPeriod | null
    benchmarkAsOf: string | null
    sourcesObserved: Record<string, number>
    resolvedSector?: QuickAnalysisSector | null
  }
  quickMetricSummary?: {
    total: number
    ok: number
    calculated: number
    nao_aplicavel: number
    sem_dado_atual: number
    erro_fonte: number
    coreTotal?: number
    coreReady?: number
    coreMissing?: number
    optionalTotal?: number
    optionalReady?: number
    optionalMissing?: number
  }
  sectorContextScore?: {
    score: number
    label: 'Excelente' | 'Forte' | 'Solido' | 'Neutro' | 'Fragil'
    sector: string
    confidence: number
    coreCoverage: number
    benchmarkComparableCore: number
    favorableVsBenchmarkCore: number
  }
  dataQualityScore?: {
    score: number
    label: 'Robusta' | 'Boa' | 'Moderada' | 'Fraca'
    coreCoverage: number
    directRate: number
    calculatedRate: number
    missingRate: number
  }

  // Novos campos (B2 + A2)
  finHubScore?: number | null
  finHubLabel?: string | null
  finHubCoverage?: number | null
  dataPeriod?: string | null
}
