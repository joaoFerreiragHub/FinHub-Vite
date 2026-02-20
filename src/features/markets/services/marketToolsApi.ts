import { apiClient } from '@/lib/api/client'

export interface CryptoAsset {
  id: string
  symbol: string
  name: string
  image?: string
  price?: number
  marketCap?: number
  dayLow?: number
  dayHigh?: number
}

export interface EtfOverlapResponse {
  etf1: string
  etf2: string
  totalOverlapWeight: number
  overlappingHoldings: Record<string, number>
}

export type EtfSectorWeight =
  | number
  | string
  | {
      etf1Weight?: number | string
      etf2Weight?: number | string
    }

export interface EtfSectorOverlapResponse {
  etf1: string
  etf2: string
  totalSectorOverlapWeight: number
  sectorOverlap: Record<string, EtfSectorWeight>
}

export interface ReitDdmResponse {
  symbol?: string
  companyName?: string
  price?: number | string
  currentDividend?: number | string | null
  paymentsPerYear?: number
  annualDividend?: number | string
  dividendYield?: number | string
  forwardAnnualDividend?: number | string | null
  forwardDividendYield?: number | string | null
  dividendCagr?: number | string
  requiredReturn?: number | string
  growthRateUsed?: number | string
  intrinsicValue?: number | string | null
  difference?: number | string | null
  cagr?: number | string
  valuation?: string | null
  ddmConfidence?: 'high' | 'low'
  ddmConfidenceNote?: string | null
  // Phase 2: Period tag
  ddmDataPeriod?: string | null
  // Phase 5: Profile detection
  reitProfile?: 'growth' | 'income' | 'mixed'
  profileConfidence?: 'high' | 'low'
}

export interface ReitFfoResponse {
  symbol?: string
  companyName?: string
  industry?: string
  price?: number | string
  reportPeriod?: string | null
  // Valor recomendado (melhor fonte disponível)
  ffo?: number | string | null
  ffoPerShare?: number | string | null
  pFFO?: number | string | null
  /** key-metrics: FMP NAREIT | simplified: padrão | simplified-specialty: estimativa (data center/torres) | not-applicable: mREIT */
  ffoSource?: 'key-metrics' | 'simplified' | 'simplified-specialty' | 'not-applicable'
  ffoNote?: string | null
  // Fontes individuais para o toggle
  ffoNaraitPerShare?: number | string | null
  pFFONarait?: number | string | null
  ffoSimplifiedPerShare?: number | string | null
  pFFOSimplified?: number | string | null
  operatingCashFlow?: number | string | null
  operatingCFPerShare?: number | string | null
  operatingCFPerShareApprox?: boolean
  ffoPayoutRatio?: number | string | null
  debtToEbitda?: number | string | null
  debtToEquity?: number | string | null
  // Phase 2: Period tag
  ffoDataPeriod?: string | null
  // Phase 4: Confidence
  ffoConfidence?: 'high' | 'medium' | 'low'
  ffoConfidenceReasons?: string[]
}

export interface EconomicNAVScenario {
  capRate?: number
  propertyValue?: number | null
  economicNav?: number | null
  navPerShare?: number | null
  priceVsNav?: number | null
}

export interface ReitNavResponse {
  symbol?: string
  companyName?: string
  price?: number | string
  marketCap?: number | string
  reportPeriod?: string | null
  nav?: number | string | null
  navPerShare?: number | string | null
  priceToNAV?: number | string | null
  premiumPercent?: number | string | null
  premium?: string | null
  economicNAV?: {
    sector?: string | null
    noIProxy?: number | null
    scenarios?: {
      optimistic?: EconomicNAVScenario
      base?: EconomicNAVScenario
      conservative?: EconomicNAVScenario
    }
  }
  // Phase 2: Period tag
  navDataPeriod?: string | null
  // Phase 4: Confidence
  navConfidence?: 'high' | 'medium' | 'low'
  navConfidenceReasons?: string[]
  // Phase 6: Implied cap rate
  impliedCapRate?: number | null
}

interface WatchlistQuickAnalysisResponse {
  symbol?: string
  name?: string
  companyName?: string
  image?: string
  price?: number | string
  marketCap?: number | string
  sector?: string
}

export interface WatchlistTickerSnapshot {
  symbol: string
  name: string
  image?: string
  price?: number
  marketCap?: number
  sector?: string
}

function toOptionalNumber(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string') {
    const parsed = Number.parseFloat(value)
    if (Number.isFinite(parsed)) return parsed
  }
  return undefined
}

export async function fetchCryptoList() {
  const { data } = await apiClient.get<CryptoAsset[]>('/crypto')
  return data ?? []
}

export async function fetchEtfOverlap(etf1: string, etf2: string) {
  const { data } = await apiClient.get<{
    overlap: EtfOverlapResponse
    sectors: EtfSectorOverlapResponse
  }>('/etfs/compare-yahoo', { params: { etf1, etf2 } })

  return {
    overlap: data.overlap,
    sectors: data.sectors,
  }
}

export async function fetchReitsToolkit(symbol: string, frequency: string) {
  const [ddmRes, ffoRes, navRes] = await Promise.all([
    apiClient.get<ReitDdmResponse>('/reits/calculateDDM', { params: { symbol, frequency } }),
    apiClient.get<ReitFfoResponse>('/reits/calculateFFO', { params: { symbol } }),
    apiClient.get<ReitNavResponse>('/reits/calculateNAV', { params: { symbol } }),
  ])

  return {
    ddm: ddmRes.data,
    ffo: ffoRes.data,
    nav: navRes.data,
  }
}

export async function fetchWatchlistTickerSnapshot(
  symbol: string,
): Promise<WatchlistTickerSnapshot> {
  const normalized = symbol.trim().toUpperCase()
  const { data } = await apiClient.get<WatchlistQuickAnalysisResponse>(
    `/stocks/quick-analysis/${normalized}`,
  )

  return {
    symbol: normalized,
    name: data?.name || data?.companyName || normalized,
    image: data?.image,
    price: toOptionalNumber(data?.price),
    marketCap: toOptionalNumber(data?.marketCap),
    sector: data?.sector,
  }
}
