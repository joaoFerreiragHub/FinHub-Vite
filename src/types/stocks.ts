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

export interface StockData {
  // Básicos
  symbol: string
  name: string // substitui companyName
  image?: string
  sector: string // substitui 'setor'
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
}
