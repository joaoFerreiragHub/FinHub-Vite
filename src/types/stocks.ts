// types/stocks.ts

export interface StockData {
  symbol: string
  companyName: string
  image?: string
  setor: string
  industry: string
  exchange: string
  pais: string
  preco: string
  marketCap: string
  enterpriseValue: string

  eps: string
  pe: string
  pegRatio: string
  dcf: string

  ebitda: string
  lucroLiquido: string
  margemEbitda: string
  roe: string

  peers: string[]

  // Extras que podes adicionar quando precisares:
  // pvpa?: string
  // cagrEps?: string
  // dividendYield?: string
  // payoutRatio?: string
}
