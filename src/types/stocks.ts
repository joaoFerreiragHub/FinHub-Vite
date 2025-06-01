export interface StockData {
  symbol: string
  companyName: string
  image?: string
  setor: string
  industry: string
  exchange: string
  pais: string
  preco: string
  valuationGrade: string // A, B, C, D, F
  marketCap: string
  enterpriseValue: string
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
  // Profitability
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

  // Dividends
  dividendYield: string
  dividend_pershare: string
  payoutRatio: string

  // Financial Health
  debtToEquity: string
  currentRatio: string
  cash: string
  interestCoverage: string

  // Debt
  netDebt: string
  totalDebt: string
  interestExpense: string
  cashRatio: string
  debtToEBITDA: string
  netDebtToEBITDA: string

  // Risks & Costs
  riskFreeRate: string
  marketRiskPremium: string
  beta: string
  costOfEquity: string
  costOfDebt: string
  effectiveTaxRate: string
  wacc: string

  // Growth
  receita: string
  receitaPorAcao: string
  receitaCagr3y: string
  receitaGrowth5y: string
  lucro: string
  lucroPorAcao: string
  lucroCagr3y: string
  lucroGrowth5y: string

  // Institutional Info
  ceo: string
  fundacao: string
  employees: string

  // Outros
  peers: string[]
}
